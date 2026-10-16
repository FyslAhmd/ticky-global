import { asc, desc, eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as schema from "@db/schema";
import { getDb } from "./connection";

// ---------------------------------------------------------------------------
// CRM contacts
// ---------------------------------------------------------------------------

export const listCrmContacts = () =>
  getDb().query.crmContacts.findMany({ orderBy: [desc(schema.crmContacts.createdAt)] });

export type CrmContactInput = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  stage?: "lead" | "prospect" | "customer" | "churned";
  notes?: string;
};

export const createCrmContact = (data: CrmContactInput) =>
  getDb().insert(schema.crmContacts).values(data);

export const updateCrmContact = (id: number, data: Partial<CrmContactInput>) =>
  getDb().update(schema.crmContacts).set(data).where(eq(schema.crmContacts.id, id));

export const deleteCrmContact = (id: number) =>
  getDb().delete(schema.crmContacts).where(eq(schema.crmContacts.id, id));

// ---------------------------------------------------------------------------
// Clients & portal users
// ---------------------------------------------------------------------------

export const listClients = () =>
  getDb().query.clients.findMany({ orderBy: [desc(schema.clients.createdAt)] });

export const getClient = (id: number) =>
  getDb().query.clients.findFirst({ where: eq(schema.clients.id, id) });

export type ClientInput = {
  company: string;
  contactName?: string;
  country?: string;
  accountManager?: string;
  tickerName?: string;
  tickerRole?: string;
  tickerStartDate?: string;
  tickerPhoto?: string;
  contractSummary?: string;
  contractFileUrl?: string;
  holidayEntitlementDays?: number;
  holidayUsedDays?: number;
  status?: "active" | "onboarding" | "paused" | "offboarded";
};

export const createClient = (data: ClientInput) => getDb().insert(schema.clients).values(data);

export const updateClient = (id: number, data: Partial<ClientInput>) =>
  getDb().update(schema.clients).set(data).where(eq(schema.clients.id, id));

export const deleteClient = async (id: number) => {
  const db = getDb();
  await db.delete(schema.clientUsers).where(eq(schema.clientUsers.clientId, id));
  await db.delete(schema.trainingPlans).where(eq(schema.trainingPlans.clientId, id));
  await db.delete(schema.portalMessages).where(eq(schema.portalMessages.clientId, id));
  await db.delete(schema.clients).where(eq(schema.clients.id, id));
};

export const listClientUsers = (clientId: number) =>
  getDb().query.clientUsers.findMany({
    where: eq(schema.clientUsers.clientId, clientId),
    orderBy: [asc(schema.clientUsers.id)],
  });

export async function createClientUser(data: {
  clientId: number;
  email: string;
  password: string;
  name?: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  await getDb().insert(schema.clientUsers).values({
    clientId: data.clientId,
    email: data.email.toLowerCase().trim(),
    passwordHash,
    name: data.name,
  });
}

export async function resetClientUserPassword(id: number, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  await getDb().update(schema.clientUsers).set({ passwordHash }).where(eq(schema.clientUsers.id, id));
}

export const deleteClientUser = (id: number) =>
  getDb().delete(schema.clientUsers).where(eq(schema.clientUsers.id, id));

// ---------------------------------------------------------------------------
// Holidays & training plans
// ---------------------------------------------------------------------------

export const listHolidays = (year?: number) =>
  getDb().query.nationalHolidays.findMany({
    where: year ? eq(schema.nationalHolidays.year, year) : undefined,
    orderBy: [asc(schema.nationalHolidays.date)],
  });

export const createHoliday = (data: { name: string; date: string; type?: "regular" | "special"; note?: string; year: number }) =>
  getDb().insert(schema.nationalHolidays).values(data);

export const deleteHoliday = (id: number) =>
  getDb().delete(schema.nationalHolidays).where(eq(schema.nationalHolidays.id, id));

export const listTrainingPlans = (clientId: number) =>
  getDb().query.trainingPlans.findMany({
    where: eq(schema.trainingPlans.clientId, clientId),
    orderBy: [asc(schema.trainingPlans.createdAt)],
  });

export const createTrainingPlan = (data: {
  clientId: number;
  title: string;
  description?: string;
  status?: "planned" | "in_progress" | "completed";
  dueDate?: string;
}) => getDb().insert(schema.trainingPlans).values(data);

export const updateTrainingPlan = (
  id: number,
  data: Partial<{ title: string; description: string; status: "planned" | "in_progress" | "completed"; dueDate: string }>,
) => getDb().update(schema.trainingPlans).set(data).where(eq(schema.trainingPlans.id, id));

export const deleteTrainingPlan = (id: number) =>
  getDb().delete(schema.trainingPlans).where(eq(schema.trainingPlans.id, id));

// ---------------------------------------------------------------------------
// Portal messages
// ---------------------------------------------------------------------------

export const listMessages = (clientId: number) =>
  getDb().query.portalMessages.findMany({
    where: eq(schema.portalMessages.clientId, clientId),
    orderBy: [asc(schema.portalMessages.createdAt)],
  });

export const sendMessage = (data: {
  clientId: number;
  senderType: "client" | "staff";
  senderName?: string;
  body: string;
}) =>
  getDb().insert(schema.portalMessages).values({
    ...data,
    readByStaff: data.senderType === "staff" ? new Date() : null,
    readByClient: data.senderType === "client" ? new Date() : null,
  });

export const markMessagesRead = (clientId: number, reader: "staff" | "client") =>
  getDb()
    .update(schema.portalMessages)
    .set(reader === "staff" ? { readByStaff: new Date() } : { readByClient: new Date() })
    .where(eq(schema.portalMessages.clientId, clientId));

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------

export const listSocialLinks = () =>
  getDb().query.socialLinks.findMany({ orderBy: [asc(schema.socialLinks.sortOrder), asc(schema.socialLinks.id)] });

export const upsertSocialLink = async (data: {
  platform: "facebook" | "instagram" | "tiktok" | "youtube" | "linkedin" | "x";
  url: string;
  label?: string;
  sortOrder?: number;
}) => {
  const db = getDb();
  const existing = await db.query.socialLinks.findFirst({
    where: eq(schema.socialLinks.platform, data.platform),
  });
  if (existing) {
    await db
      .update(schema.socialLinks)
      .set({ url: data.url, label: data.label, sortOrder: data.sortOrder })
      .where(eq(schema.socialLinks.id, existing.id));
  } else {
    await db.insert(schema.socialLinks).values(data);
  }
};

export const deleteSocialLink = (id: number) =>
  getDb().delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export const listPublishedPosts = () =>
  getDb().query.posts.findMany({
    where: eq(schema.posts.status, "published"),
    orderBy: [desc(schema.posts.publishedAt)],
  });

export const getPostBySlug = (slug: string) =>
  getDb().query.posts.findFirst({
    where: eq(schema.posts.slug, slug),
  });

export const listAllPosts = () =>
  getDb().query.posts.findMany({ orderBy: [desc(schema.posts.createdAt)] });

export type InsertPost = typeof schema.posts.$inferInsert;

export const createPost = (data: InsertPost) => getDb().insert(schema.posts).values(data);

export const updatePost = (id: number, data: Partial<InsertPost>) =>
  getDb().update(schema.posts).set(data).where(eq(schema.posts.id, id));

export const deletePost = (id: number) =>
  getDb().delete(schema.posts).where(eq(schema.posts.id, id));

// ---------------------------------------------------------------------------
// Tracking / integrations settings (single JSON row in site_settings)
// ---------------------------------------------------------------------------

export type TrackingConfig = {
  enabled: boolean;
  gtmId: string;
  ga4Id: string;
  googleAdsId: string;
  conversionLabels: {
    enquiry_submitted: string;
    calculator_used: string;
    cta_click: string;
  };
};

export const DEFAULT_TRACKING_CONFIG: TrackingConfig = {
  enabled: false,
  gtmId: "",
  ga4Id: "",
  googleAdsId: "",
  conversionLabels: { enquiry_submitted: "", calculator_used: "", cta_click: "" },
};

const TRACKING_KEY = "tracking";

export async function getTrackingConfig(): Promise<TrackingConfig> {
  const row = await getDb().query.siteSettings.findFirst({
    where: eq(schema.siteSettings.key, TRACKING_KEY),
  });
  if (!row?.value) return { ...DEFAULT_TRACKING_CONFIG };
  try {
    const parsed = JSON.parse(row.value) as Partial<TrackingConfig>;
    return {
      ...DEFAULT_TRACKING_CONFIG,
      ...parsed,
      conversionLabels: {
        ...DEFAULT_TRACKING_CONFIG.conversionLabels,
        ...(parsed.conversionLabels ?? {}),
      },
    };
  } catch {
    return { ...DEFAULT_TRACKING_CONFIG };
  }
}

export async function saveTrackingConfig(config: TrackingConfig) {
  const value = JSON.stringify(config);
  await getDb()
    .insert(schema.siteSettings)
    .values({ key: TRACKING_KEY, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

// ---------------------------------------------------------------------------
// Media library (uploaded images/files)
// ---------------------------------------------------------------------------

export const listMedia = () =>
  getDb().query.mediaFiles.findMany({
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

export const createMedia = (data: {
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy?: number;
}) => getDb().insert(schema.mediaFiles).values(data);

export const getMedia = (id: number) =>
  getDb().query.mediaFiles.findFirst({ where: eq(schema.mediaFiles.id, id) });

export const deleteMedia = (id: number) =>
  getDb().delete(schema.mediaFiles).where(eq(schema.mediaFiles.id, id));
