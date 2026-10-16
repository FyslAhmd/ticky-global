import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import {
  createRouter,
  adminQuery,
  authedQuery,
  permQuery,
  publicQuery,
  PERMISSION_KEYS,
} from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";
import {
  listCrmContacts,
  createCrmContact,
  updateCrmContact,
  deleteCrmContact,
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  listClientUsers,
  createClientUser,
  resetClientUserPassword,
  deleteClientUser,
  listHolidays,
  createHoliday,
  deleteHoliday,
  listTrainingPlans,
  createTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  listMessages,
  sendMessage,
  markMessagesRead,
  listSocialLinks,
  upsertSocialLink,
  deleteSocialLink,
  listPublishedPosts,
  getPostBySlug,
  listAllPosts,
  createPost,
  updatePost,
  deletePost,
  getTrackingConfig,
  saveTrackingConfig,
  DEFAULT_TRACKING_CONFIG,
  type TrackingConfig,
  listMedia,
  createMedia,
  getMedia,
  deleteMedia,
} from "./queries/portal";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Staff user management (admin only) — varying levels of access
// ---------------------------------------------------------------------------

const permissionsInput = z.array(z.enum(PERMISSION_KEYS)).default([]);

export const usersRouter = createRouter({
  permissionKeys: authedQuery.query(() => PERMISSION_KEYS),

  list: adminQuery.query(async () => {
    const rows = await getDb().query.users.findMany({ orderBy: [eq(schema.users.id, schema.users.id)] });
    return rows.map(({ passwordHash: _omit, ...rest }) => rest);
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        password: z.string().min(8).max(200),
        role: z.enum(["user", "admin"]).default("user"),
        permissions: permissionsInput,
      }),
    )
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const existing = await getDb()
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);
      if (existing.length) {
        throw new TRPCError({ code: "CONFLICT", message: "A user with this email already exists." });
      }
      const passwordHash = await bcrypt.hash(input.password, 12);
      await getDb().insert(schema.users).values({
        name: input.name.trim(),
        email,
        passwordHash,
        role: input.role,
        permissions: input.permissions.join(","),
        lastSignInAt: new Date(),
      });
      return { ok: true };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(1).max(255).optional(),
        role: z.enum(["user", "admin"]).optional(),
        permissions: permissionsInput.optional(),
        password: z.string().min(8).max(200).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const data: Record<string, unknown> = {};
      if (input.name !== undefined) data.name = input.name.trim();
      if (input.role !== undefined) data.role = input.role;
      if (input.permissions !== undefined) data.permissions = input.permissions.join(",");
      if (input.password) data.passwordHash = await bcrypt.hash(input.password, 12);
      // Prevent an admin from demoting themselves out of admin
      if (input.id === ctx.user.id && input.role && input.role !== "admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot remove your own admin role." });
      }
      await getDb().update(schema.users).set(data).where(eq(schema.users.id, input.id));
      return { ok: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      if (input.id === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot delete your own account." });
      }
      await getDb().delete(schema.users).where(eq(schema.users.id, input.id));
      return { ok: true };
    }),
});

// ---------------------------------------------------------------------------
// CRM contacts
// ---------------------------------------------------------------------------

const crmInput = z.object({
  name: z.string().min(1).max(255),
  company: z.string().max(255).optional(),
  email: z.string().email().max(320).optional().or(z.literal("")),
  phone: z.string().max(64).optional(),
  source: z.string().max(128).optional(),
  stage: z.enum(["lead", "prospect", "customer", "churned"]).default("lead"),
  notes: z.string().max(5000).optional(),
});

export const crmRouter = createRouter({
  list: permQuery("crm").query(() => listCrmContacts()),
  create: permQuery("crm").input(crmInput).mutation(({ input }) => createCrmContact(input)),
  update: permQuery("crm")
    .input(z.object({ id: z.number().int(), data: crmInput.partial() }))
    .mutation(({ input }) => updateCrmContact(input.id, input.data)),
  delete: permQuery("crm")
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input }) => deleteCrmContact(input.id)),
});

// ---------------------------------------------------------------------------
// Marketing: socials + blog
// ---------------------------------------------------------------------------

export const marketingRouter = createRouter({
  socials: createRouter({
    list: permQuery("marketing").query(() => listSocialLinks()),
    upsert: permQuery("marketing")
      .input(
        z.object({
          platform: z.enum(["facebook", "instagram", "tiktok", "youtube", "linkedin", "x"]),
          url: z.string().url().max(1000),
          label: z.string().max(255).optional(),
          sortOrder: z.number().int().default(0),
        }),
      )
      .mutation(({ input }) => upsertSocialLink(input)),
    delete: permQuery("marketing")
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deleteSocialLink(input.id)),
  }),

  blog: createRouter({
    list: permQuery("marketing").query(() => listAllPosts()),
    create: permQuery("marketing")
      .input(
        z.object({
          slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
          title: z.string().min(1).max(500),
          excerpt: z.string().max(1000).optional(),
          content: z.string().min(1),
          coverImage: z.string().max(1000).optional(),
          status: z.enum(["draft", "published", "archived"]),
        }),
      )
      .mutation(({ input, ctx }) =>
        createPost({
          ...input,
          authorId: ctx.user!.id,
          publishedAt: input.status === "published" ? new Date() : null,
        }),
      ),
    update: permQuery("marketing")
      .input(
        z.object({
          id: z.number().int(),
          data: z
            .object({
              slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
              title: z.string().min(1).max(500),
              excerpt: z.string().max(1000),
              content: z.string().min(1),
              coverImage: z.string().max(1000),
              status: z.enum(["draft", "published", "archived"]),
            })
            .partial(),
        }),
      )
      .mutation(async ({ input }) => {
        const data: Record<string, unknown> = { ...input.data };
        if (input.data.status === "published") {
          const existing = await getDb().query.posts.findFirst({ where: eq(schema.posts.id, input.id) });
          if (existing && !existing.publishedAt) data.publishedAt = new Date();
        }
        return updatePost(input.id, data);
      }),
    delete: permQuery("marketing")
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deletePost(input.id)),
  }),
});

// ---------------------------------------------------------------------------
// Clients & their portal accounts (staff side)
// ---------------------------------------------------------------------------

const clientInput = z.object({
  company: z.string().min(1).max(255),
  contactName: z.string().max(255).optional(),
  country: z.string().max(8).optional(),
  accountManager: z.string().max(255).optional(),
  tickerName: z.string().max(255).optional(),
  tickerRole: z.string().max(255).optional(),
  tickerStartDate: z.string().max(32).optional(),
  tickerPhoto: z.string().max(500).optional(),
  contractSummary: z.string().max(10000).optional(),
  contractFileUrl: z.string().max(1000).optional(),
  holidayEntitlementDays: z.number().int().min(0).max(60).optional(),
  holidayUsedDays: z.number().int().min(0).max(60).optional(),
  status: z.enum(["active", "onboarding", "paused", "offboarded"]).optional(),
});

export const clientsRouter = createRouter({
  list: permQuery("clients").query(() => listClients()),
  get: permQuery("clients").input(z.object({ id: z.number().int() })).query(({ input }) => getClient(input.id)),
  create: permQuery("clients").input(clientInput).mutation(({ input }) => createClient(input)),
  update: permQuery("clients")
    .input(z.object({ id: z.number().int(), data: clientInput.partial() }))
    .mutation(({ input }) => updateClient(input.id, input.data)),
  delete: permQuery("clients")
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input }) => deleteClient(input.id)),

  portalUsers: createRouter({
    list: permQuery("clients")
      .input(z.object({ clientId: z.number().int() }))
      .query(async ({ input }) => {
        const rows = await listClientUsers(input.clientId);
        return rows.map(({ passwordHash: _omit, ...rest }) => rest);
      }),
    create: permQuery("clients")
      .input(
        z.object({
          clientId: z.number().int(),
          email: z.string().email().max(320),
          password: z.string().min(8).max(200),
          name: z.string().max(255).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const email = input.email.toLowerCase().trim();
        const existing = await getDb()
          .select({ id: schema.clientUsers.id })
          .from(schema.clientUsers)
          .where(eq(schema.clientUsers.email, email))
          .limit(1);
        if (existing.length) {
          throw new TRPCError({ code: "CONFLICT", message: "A portal account with this email already exists." });
        }
        await createClientUser(input);
        return { ok: true };
      }),
    resetPassword: permQuery("clients")
      .input(z.object({ id: z.number().int(), password: z.string().min(8).max(200) }))
      .mutation(({ input }) => resetClientUserPassword(input.id, input.password)),
    delete: permQuery("clients")
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deleteClientUser(input.id)),
  }),

  holidays: createRouter({
    list: permQuery("clients").input(z.object({ year: z.number().int().optional() }).optional()).query(({ input }) => listHolidays(input?.year)),
    create: permQuery("clients")
      .input(z.object({ name: z.string().min(1).max(255), date: z.string().min(4).max(32), type: z.enum(["regular", "special"]).default("regular"), note: z.string().max(500).optional(), year: z.number().int() }))
      .mutation(({ input }) => createHoliday(input)),
    delete: permQuery("clients")
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deleteHoliday(input.id)),
  }),

  training: createRouter({
    list: permQuery("clients").input(z.object({ clientId: z.number().int() })).query(({ input }) => listTrainingPlans(input.clientId)),
    create: permQuery("clients")
      .input(z.object({ clientId: z.number().int(), title: z.string().min(1).max(255), description: z.string().max(5000).optional(), status: z.enum(["planned", "in_progress", "completed"]).default("planned"), dueDate: z.string().max(32).optional() }))
      .mutation(({ input }) => createTrainingPlan(input)),
    update: permQuery("clients")
      .input(z.object({ id: z.number().int(), data: z.object({ title: z.string().min(1).max(255), description: z.string().max(5000), status: z.enum(["planned", "in_progress", "completed"]), dueDate: z.string().max(32) }).partial() }))
      .mutation(({ input }) => updateTrainingPlan(input.id, input.data)),
    delete: permQuery("clients")
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deleteTrainingPlan(input.id)),
  }),

  messages: createRouter({
    list: permQuery("clients").input(z.object({ clientId: z.number().int() })).query(async ({ input }) => {
      await markMessagesRead(input.clientId, "staff");
      return listMessages(input.clientId);
    }),
    send: permQuery("clients")
      .input(z.object({ clientId: z.number().int(), body: z.string().min(1).max(5000) }))
      .mutation(({ input, ctx }) =>
        sendMessage({ clientId: input.clientId, senderType: "staff", senderName: ctx.user!.name ?? "Ticky Account Manager", body: input.body }),
      ),
  }),
});

// ---------------------------------------------------------------------------
// Client portal (client side) — session is a client_users account
// ---------------------------------------------------------------------------

export const portalRouter = createRouter({
  me: publicQuery.query(({ ctx }) => ctx.clientUser ?? null),

  dashboard: publicQuery.query(async ({ ctx }) => {
    if (!ctx.clientUser) throw new TRPCError({ code: "UNAUTHORIZED" });
    const client = await getClient(ctx.clientUser.clientId);
    if (!client) throw new TRPCError({ code: "NOT_FOUND" });
    const [holidays, training] = await Promise.all([
      listHolidays(new Date().getFullYear()),
      listTrainingPlans(client.id),
    ]);
    return { client, holidays, training };
  }),

  messages: createRouter({
    list: publicQuery.query(async ({ ctx }) => {
      if (!ctx.clientUser) throw new TRPCError({ code: "UNAUTHORIZED" });
      await markMessagesRead(ctx.clientUser.clientId, "client");
      return listMessages(ctx.clientUser.clientId);
    }),
    send: publicQuery
      .input(z.object({ body: z.string().min(1).max(5000) }))
      .mutation(({ ctx, input }) => {
        if (!ctx.clientUser) throw new TRPCError({ code: "UNAUTHORIZED" });
        return sendMessage({
          clientId: ctx.clientUser.clientId,
          senderType: "client",
          senderName: ctx.clientUser.name ?? ctx.clientUser.email,
          body: input.body,
        });
      }),
  }),
});

// ---------------------------------------------------------------------------
// Public marketing data
// ---------------------------------------------------------------------------

export const marketingPublicRouter = createRouter({
  socials: publicQuery.query(() => listSocialLinks()),
  posts: publicQuery.query(() => listPublishedPosts()),
  post: publicQuery.input(z.object({ slug: z.string() })).query(({ input }) => getPostBySlug(input.slug)),
  /**
   * Public tracking config — GA4/GTM/Google Ads IDs are public by nature
   * (visible in any page's source once scripts load). Returns the disabled
   * default until the PPC manager activates tracking in the admin panel.
   */
  trackingConfig: publicQuery.query(async () => {
    const config = await getTrackingConfig();
    return config.enabled ? config : { ...DEFAULT_TRACKING_CONFIG };
  }),
});

// ---------------------------------------------------------------------------
// Integrations control panel (GA4 / GTM / Google Ads) — PPC manager
// ---------------------------------------------------------------------------

const idPattern = (re: RegExp) =>
  z.string().trim().regex(re, "Invalid ID format").or(z.literal("")).default("");

const trackingConfigInput = z.object({
  enabled: z.boolean(),
  gtmId: idPattern(/^GTM-[A-Z0-9]{4,12}$/i),
  ga4Id: idPattern(/^G-[A-Z0-9]{4,12}$/i),
  googleAdsId: idPattern(/^AW-\d{6,14}$/i),
  conversionLabels: z.object({
    enquiry_submitted: z.string().trim().max(100).default(""),
    calculator_used: z.string().trim().max(100).default(""),
    cta_click: z.string().trim().max(100).default(""),
  }),
});

export const integrationsRouter = createRouter({
  /** Full config for the admin panel (requires the integrations permission). */
  get: permQuery("integrations").query(() => getTrackingConfig()),

  update: permQuery("integrations")
    .input(trackingConfigInput)
    .mutation(async ({ input }) => {
      // normalise IDs to upper-case
      const config: TrackingConfig = {
        enabled: input.enabled,
        gtmId: input.gtmId.toUpperCase(),
        ga4Id: input.ga4Id.toUpperCase(),
        googleAdsId: input.googleAdsId.toUpperCase(),
        conversionLabels: input.conversionLabels,
      };
      if (config.enabled && !config.gtmId && !config.ga4Id && !config.googleAdsId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enter at least one ID (GA4, GTM or Google Ads) before enabling tracking.",
        });
      }
      await saveTrackingConfig(config);
      return config;
    }),

  /** Recent on-site events so the PPC manager can confirm data is flowing. */
  recentEvents: permQuery("integrations").query(async () => {
    const db = getDb();
    return db.query.analyticsEvents.findMany({
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      limit: 15,
    });
  }),
});

// ---------------------------------------------------------------------------
// Media library — upload images once, reuse across reviews, blog, pages, etc.
// Files are stored in public/uploads/ and served as /uploads/<file>.
// ---------------------------------------------------------------------------

const UPLOAD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/uploads");
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

function uploadsDir() {
  // production build runs from dist/, so resolve relative to project root
  const candidates = [
    UPLOAD_DIR,
    path.resolve(process.cwd(), "public/uploads"),
    path.resolve(process.cwd(), "dist/public/uploads"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  fs.mkdirSync(candidates[0], { recursive: true });
  return candidates[0];
}

export const mediaRouter = createRouter({
  list: authedQuery.query(() => listMedia()),

  upload: authedQuery
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.string().min(3).max(100),
        dataBase64: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ext = ALLOWED_MIME[input.mimeType];
      if (!ext) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Only image files are allowed (JPG, PNG, WebP, GIF, SVG, AVIF)." });
      }
      const buffer = Buffer.from(input.dataBase64, "base64");
      if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Images must be under 5MB." });
      }
      const safeBase = input.fileName
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "image";
      const fileName = `${Date.now()}-${safeBase}${ext}`;
      fs.writeFileSync(path.join(uploadsDir(), fileName), buffer);

      // mirror into dist/public/uploads if the production build exists
      const distUploads = path.resolve(process.cwd(), "dist/public/uploads");
      try {
        if (fs.existsSync(path.resolve(process.cwd(), "dist/public"))) {
          fs.mkdirSync(distUploads, { recursive: true });
          fs.copyFileSync(path.join(uploadsDir(), fileName), path.join(distUploads, fileName));
        }
      } catch { /* dev mode */ }

      const url = `/uploads/${fileName}`;
      await createMedia({
        fileName: input.fileName.slice(0, 255),
        url,
        mimeType: input.mimeType,
        size: buffer.length,
        uploadedBy: ctx.user?.id,
      });
      return { url, fileName };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const media = await getMedia(input.id);
      if (!media) throw new TRPCError({ code: "NOT_FOUND" });
      await deleteMedia(input.id);
      // best-effort file removal
      for (const dir of [uploadsDir(), path.resolve(process.cwd(), "dist/public/uploads")]) {
        try { fs.unlinkSync(path.join(dir, path.basename(media.url))); } catch { /* already gone */ }
      }
      return { ok: true };
    }),
});

