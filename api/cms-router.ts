import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import {
  createEnquiry,
  listEnquiries,
  updateEnquiry,
  deleteEnquiry,
  listPublishedReviews,
  listAllReviews,
  createReview,
  updateReview,
  deleteReview,
  listPublishedPages,
  getPublishedPageBySlug,
  listAllPages,
  createPage,
  updatePage,
  deletePage,
  trackEvent,
  getAnalyticsSummary,
} from "./queries/cms";
import { getDb } from "./queries/connection";

const statusEnum = z.enum(["new", "contacted", "qualified", "won", "lost"]);
const publishStatusEnum = z.enum(["draft", "published", "archived"]);

const reviewInput = z.object({
  slug: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  industry: z.string().min(1).max(255),
  hires: z.array(z.string()).min(1),
  saving: z.string().min(1).max(128),
  rating: z.number().int().min(1).max(5),
  headline: z.string().min(1).max(500),
  quote: z.string().min(1),
  story: z.array(z.string()).min(1),
  photo: z.string().optional(),
  status: publishStatusEnum,
  sortOrder: z.number().int().default(0),
});

// ---------------------------------------------------------------------------
// Public procedures — consumed by the marketing site
// ---------------------------------------------------------------------------

export const publicRouter = createRouter({
  submitEnquiry: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(255),
        company: z.string().min(1, "Company is required").max(255),
        email: z.string().email("A valid email is required").max(320),
        phone: z.string().max(64).optional(),
        roleInterest: z.string().max(128).optional(),
        hours: z.enum(["full", "part", "unsure"]).optional(),
        message: z.string().max(5000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const enquiry = await createEnquiry(input);
      return { ok: true, id: enquiry?.id };
    }),

  reviews: publicQuery.query(async () => {
    const rows = await listPublishedReviews();
    return rows.map((r) => ({
      ...r,
      hires: JSON.parse(r.hires) as string[],
      story: JSON.parse(r.story) as string[],
    }));
  }),

  pages: publicQuery.query(() => listPublishedPages()),

  pageBySlug: publicQuery
    .input(z.object({ slug: z.string().min(1).max(255) }))
    .query(async ({ input }) => {
      const page = await getPublishedPageBySlug(input.slug);
      if (!page) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      return page;
    }),

  track: publicQuery
    .input(
      z.object({
        type: z.enum(["pageview", "enquiry_submit"]).default("pageview"),
        path: z.string().min(1).max(500),
        referrer: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ua = ctx.req.headers.get("user-agent") ?? undefined;
      // don't count obvious bots / crawlers
      if (ua && /bot|crawler|spider|headless/i.test(ua)) return { ok: true };
      await trackEvent({ type: input.type, path: input.path, referrer: input.referrer, userAgent: ua?.slice(0, 500) });
      return { ok: true };
    }),
});

// ---------------------------------------------------------------------------
// Staff procedures — any signed-in team member
// ---------------------------------------------------------------------------

export const staffRouter = createRouter({
  me: authedQuery.query(({ ctx }) => ctx.user),

  analyticsSummary: authedQuery
    .input(z.object({ days: z.number().int().min(1).max(365).default(30) }))
    .query(({ input }) => getAnalyticsSummary(input.days)),

  enquiries: createRouter({
    list: authedQuery
      .input(z.object({ status: statusEnum.optional() }).optional())
      .query(({ input }) => listEnquiries(input?.status)),
    update: authedQuery
      .input(
        z.object({
          id: z.number().int(),
          status: statusEnum.optional(),
          notes: z.string().max(10000).optional(),
        }),
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateEnquiry(id, data);
      }),
    delete: adminQuery
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deleteEnquiry(input.id)),
  }),

  reviews: createRouter({
    list: authedQuery.query(() => listAllReviews()),
    create: authedQuery.input(reviewInput).mutation(({ input }) => createReview(input)),
    update: authedQuery
      .input(z.object({ id: z.number().int(), data: reviewInput.partial() }))
      .mutation(({ input }) => updateReview(input.id, input.data)),
    delete: authedQuery
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deleteReview(input.id)),
  }),

  pages: createRouter({
    list: authedQuery.query(() => listAllPages()),
    create: authedQuery
      .input(
        z.object({
          slug: z
            .string()
            .min(1)
            .max(255)
            .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
          title: z.string().min(1).max(500),
          excerpt: z.string().max(1000).optional(),
          content: z.string().min(1),
          status: publishStatusEnum,
        }),
      )
      .mutation(({ ctx, input }) => createPage({ ...input, authorId: ctx.user.id })),
    update: authedQuery
      .input(
        z.object({
          id: z.number().int(),
          data: z
            .object({
              slug: z
                .string()
                .min(1)
                .max(255)
                .regex(/^[a-z0-9-]+$/),
              title: z.string().min(1).max(500),
              excerpt: z.string().max(1000),
              content: z.string().min(1),
              status: publishStatusEnum,
            })
            .partial(),
        }),
      )
      .mutation(({ input }) => updatePage(input.id, input.data)),
    delete: authedQuery
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => deletePage(input.id)),
  }),

  team: adminQuery.query(() => getDb().query.users.findMany()),
});
