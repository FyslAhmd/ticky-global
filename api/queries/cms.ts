import { getDb } from "./connection";
import { enquiries, reviews, pages, analyticsEvents } from "@db/schema";
import { eq, desc, asc, and, gte, lte, sql, inArray, type SQL } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

export async function createEnquiry(data: {
  name: string;
  company: string;
  email: string;
  phone?: string;
  roleInterest?: string;
  hours?: "full" | "part" | "unsure";
  message?: string;
}) {
  const [{ id }] = await getDb().insert(enquiries).values(data).$returningId();
  return getDb().query.enquiries.findFirst({ where: eq(enquiries.id, id) });
}

export async function listEnquiries(status?: string) {
  const where = status
    ? eq(enquiries.status, status as "new" | "contacted" | "qualified" | "won" | "lost")
    : undefined;
  return getDb().query.enquiries.findMany({
    where,
    orderBy: [desc(enquiries.createdAt)],
  });
}

export async function updateEnquiry(
  id: number,
  data: Partial<{
    status: "new" | "contacted" | "qualified" | "won" | "lost";
    notes: string;
    assignedToId: number | null;
  }>,
) {
  await getDb().update(enquiries).set(data).where(eq(enquiries.id, id));
  return getDb().query.enquiries.findFirst({ where: eq(enquiries.id, id) });
}

export async function deleteEnquiry(id: number) {
  await getDb().delete(enquiries).where(eq(enquiries.id, id));
}

export async function bulkUpdateEnquiryStatus(
  ids: number[],
  status: "new" | "contacted" | "qualified" | "won" | "lost",
) {
  if (ids.length === 0) return;
  await getDb().update(enquiries).set({ status }).where(inArray(enquiries.id, ids));
}

export async function bulkDeleteEnquiries(ids: number[]) {
  if (ids.length === 0) return;
  await getDb().delete(enquiries).where(inArray(enquiries.id, ids));
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function listPublishedReviews() {
  return getDb().query.reviews.findMany({
    where: eq(reviews.status, "published"),
    orderBy: [asc(reviews.sortOrder), asc(reviews.id)],
  });
}

export async function listAllReviews() {
  return getDb().query.reviews.findMany({
    orderBy: [asc(reviews.sortOrder), asc(reviews.id)],
  });
}

export async function createReview(data: {
  slug: string;
  name: string;
  role: string;
  company: string;
  location: string;
  industry: string;
  hires: string[];
  saving: string;
  rating: number;
  headline: string;
  quote: string;
  story: string[];
  photo?: string;
  status: "draft" | "published" | "archived";
  sortOrder: number;
}) {
  const [{ id }] = await getDb()
    .insert(reviews)
    .values({
      ...data,
      hires: JSON.stringify(data.hires),
      story: JSON.stringify(data.story),
    })
    .$returningId();
  return getDb().query.reviews.findFirst({ where: eq(reviews.id, id) });
}

export async function updateReview(
  id: number,
  data: Partial<{
    slug: string;
    name: string;
    role: string;
    company: string;
    location: string;
    industry: string;
    hires: string[];
    saving: string;
    rating: number;
    headline: string;
    quote: string;
    story: string[];
    photo: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
  }>,
) {
  const { hires, story, ...rest } = data;
  await getDb()
    .update(reviews)
    .set({
      ...rest,
      ...(hires ? { hires: JSON.stringify(hires) } : {}),
      ...(story ? { story: JSON.stringify(story) } : {}),
    })
    .where(eq(reviews.id, id));
  return getDb().query.reviews.findFirst({ where: eq(reviews.id, id) });
}

export async function deleteReview(id: number) {
  await getDb().delete(reviews).where(eq(reviews.id, id));
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export async function listPublishedPages() {
  return getDb().query.pages.findMany({
    where: eq(pages.status, "published"),
    orderBy: [desc(pages.createdAt)],
    columns: { content: false },
  });
}

export async function getPublishedPageBySlug(slug: string) {
  return getDb().query.pages.findFirst({
    where: and(eq(pages.slug, slug), eq(pages.status, "published")),
  });
}

export async function listAllPages() {
  return getDb().query.pages.findMany({ orderBy: [desc(pages.updatedAt)] });
}

export async function createPage(data: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  status: "draft" | "published" | "archived";
  authorId?: number;
}) {
  const [{ id }] = await getDb().insert(pages).values(data).$returningId();
  return getDb().query.pages.findFirst({ where: eq(pages.id, id) });
}

export async function updatePage(
  id: number,
  data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    status: "draft" | "published" | "archived";
  }>,
) {
  await getDb().update(pages).set(data).where(eq(pages.id, id));
  return getDb().query.pages.findFirst({ where: eq(pages.id, id) });
}

export async function deletePage(id: number) {
  await getDb().delete(pages).where(eq(pages.id, id));
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function trackEvent(data: {
  type: "pageview" | "enquiry_submit";
  path: string;
  referrer?: string;
  userAgent?: string;
}) {
  await getDb().insert(analyticsEvents).values(data);
}

export type AnalyticsRange = { days?: number; from?: string; to?: string };

/** Resolve a summary range to an inclusive [since, until] window. */
function resolveRange(range: number | AnalyticsRange): { since: Date; until: Date } {
  if (typeof range === "number") {
    const until = new Date();
    return { since: new Date(Date.now() - range * 24 * 60 * 60 * 1000), until };
  }
  const until = range.to ? new Date(`${range.to}T23:59:59.999Z`) : new Date();
  const since = range.from
    ? new Date(`${range.from}T00:00:00.000Z`)
    : new Date(until.getTime() - (range.days ?? 30) * 24 * 60 * 60 * 1000);
  return { since, until };
}

export async function getAnalyticsSummary(range: number | AnalyticsRange) {
  const { since, until } = resolveRange(range);
  const db = getDb();
  const where: SQL = and(
    eq(analyticsEvents.type, "pageview"),
    gte(analyticsEvents.createdAt, since),
    lte(analyticsEvents.createdAt, until),
  )!;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(where);

  const byDay = await db
    .select({
      day: sql<string>`max(date_format(${analyticsEvents.createdAt}, '%Y-%m-%d'))`,
      views: sql<number>`count(*)`,
    })
    .from(analyticsEvents)
    .where(where)
    .groupBy(sql`date_format(${analyticsEvents.createdAt}, '%Y-%m-%d')`)
    .orderBy(sql`date_format(${analyticsEvents.createdAt}, '%Y-%m-%d')`);

  const topPages = await db
    .select({
      path: analyticsEvents.path,
      views: sql<number>`count(*)`,
    })
    .from(analyticsEvents)
    .where(where)
    .groupBy(analyticsEvents.path)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const topReferrers = await db
    .select({
      referrer: analyticsEvents.referrer,
      views: sql<number>`count(*)`,
    })
    .from(analyticsEvents)
    .where(and(where, sql`${analyticsEvents.referrer} is not null and ${analyticsEvents.referrer} != ''`))
    .groupBy(analyticsEvents.referrer)
    .orderBy(sql`count(*) desc`)
    .limit(8);

  const [{ newEnquiries }] = await db
    .select({ newEnquiries: sql<number>`count(*)` })
    .from(enquiries)
    .where(and(gte(enquiries.createdAt, since), lte(enquiries.createdAt, until)));

  // Hourly breakdown — only meaningful for "Today" (single-day range ending now)
  const isToday = since.toDateString() === new Date().toDateString();
  let byHour: { hour: number; views: number }[] = [];
  if (isToday) {
    const rows = await db
      .select({
        hour: sql<number>`max(hour(${analyticsEvents.createdAt}))`,
        views: sql<number>`count(*)`,
      })
      .from(analyticsEvents)
      .where(where)
      .groupBy(sql`hour(${analyticsEvents.createdAt})`)
      .orderBy(sql`hour(${analyticsEvents.createdAt})`);
    byHour = rows.map((r) => ({ hour: Number(r.hour), views: Number(r.views) }));
  }

  return {
    totalViews: Number(total ?? 0),
    newEnquiries: Number(newEnquiries ?? 0),
    byHour,
    byDay: byDay.map((r) => ({ day: r.day, views: Number(r.views) })),
    topPages: topPages.map((r) => ({ path: r.path, views: Number(r.views) })),
    topReferrers: topReferrers.map((r) => ({
      referrer: r.referrer ?? "",
      views: Number(r.views),
    })),
  };
}

/** Latest individual analytics events — powers the "live" activity feed. */
export async function getRecentActivity(limit = 20) {
  const db = getDb();
  const rows = await db
    .select({
      id: analyticsEvents.id,
      type: analyticsEvents.type,
      path: analyticsEvents.path,
      referrer: analyticsEvents.referrer,
      createdAt: analyticsEvents.createdAt,
    })
    .from(analyticsEvents)
    .orderBy(desc(analyticsEvents.id))
    .limit(Math.min(limit, 100));
  return rows.map((r) => ({
    id: Number(r.id),
    type: r.type,
    path: r.path,
    referrer: r.referrer ?? null,
    at: r.createdAt.toISOString(),
  }));
}
