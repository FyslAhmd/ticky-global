import { getDb } from "./connection";
import { enquiries, reviews, pages, analyticsEvents } from "@db/schema";
import { eq, desc, asc, and, gte, sql, type SQL } from "drizzle-orm";

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

export async function getAnalyticsSummary(days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const db = getDb();
  const where: SQL = and(
    eq(analyticsEvents.type, "pageview"),
    gte(analyticsEvents.createdAt, since),
  )!;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(where);

  const byDay = await db
    .select({
      day: sql<string>`date_format(${analyticsEvents.createdAt}, '%Y-%m-%d')`,
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
    .where(gte(enquiries.createdAt, since));

  return {
    totalViews: Number(total ?? 0),
    newEnquiries: Number(newEnquiries ?? 0),
    byDay: byDay.map((r) => ({ day: r.day, views: Number(r.views) })),
    topPages: topPages.map((r) => ({ path: r.path, views: Number(r.views) })),
    topReferrers: topReferrers.map((r) => ({
      referrer: r.referrer ?? "",
      views: Number(r.views),
    })),
  };
}
