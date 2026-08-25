import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Comma-separated permission keys (e.g. "enquiries,reviews"). Empty = none. Admins bypass. */
  permissions: varchar("permissions", { length: 500 }).default("").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ---------------------------------------------------------------------------
// Ticky Global CMS tables
// ---------------------------------------------------------------------------

/** Enquiries submitted through the public contact / discovery-call form */
export const enquiries = mysqlTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  roleInterest: varchar("roleInterest", { length: 128 }),
  hours: mysqlEnum("hours", ["full", "part", "unsure"]),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "won", "lost"])
    .default("new")
    .notNull(),
  notes: text("notes"),
  assignedToId: bigint("assignedToId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;

/** Client reviews / testimonials (managed by staff, shown on the public site) */
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 255 }).notNull(),
  hires: text("hires").notNull(), // JSON array of strings
  saving: varchar("saving", { length: 128 }).notNull(),
  rating: int("rating").default(5).notNull(),
  headline: varchar("headline", { length: 500 }).notNull(),
  quote: text("quote").notNull(),
  story: text("story").notNull(), // JSON array of paragraphs
  photo: text("photo"),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/** Staff-created content pages, rendered publicly at /p/:slug */
export const pages = mysqlTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: varchar("excerpt", { length: 1000 }),
  content: text("content").notNull(), // markdown-ish body
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  authorId: bigint("authorId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

/** Raw analytics events (page views) tracked on the public site */
export const analyticsEvents = mysqlTable("analytics_events", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["pageview", "enquiry_submit"]).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  referrer: varchar("referrer", { length: 1000 }),
  userAgent: varchar("userAgent", { length: 500 }),
  country: varchar("country", { length: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// ---------------------------------------------------------------------------
// CRM, clients, marketing & portal tables
// ---------------------------------------------------------------------------

/** CRM contacts — leads and contacts independent of form enquiries */
export const crmContacts = mysqlTable("crm_contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  source: varchar("source", { length: 128 }),
  stage: mysqlEnum("stage", ["lead", "prospect", "customer", "churned"])
    .default("lead")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CrmContact = typeof crmContacts.$inferSelect;

/** Clients — companies with a Ticky team member (a "Ticker") and a portal */
export const clients = mysqlTable("clients", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  country: varchar("country", { length: 8 }).default("uk").notNull(),
  accountManager: varchar("accountManager", { length: 255 }),
  tickerName: varchar("tickerName", { length: 255 }),
  tickerRole: varchar("tickerRole", { length: 255 }),
  tickerStartDate: varchar("tickerStartDate", { length: 32 }),
  tickerPhoto: varchar("tickerPhoto", { length: 500 }),
  contractSummary: text("contractSummary"),
  contractFileUrl: varchar("contractFileUrl", { length: 1000 }),
  holidayEntitlementDays: int("holidayEntitlementDays").default(20).notNull(),
  holidayUsedDays: int("holidayUsedDays").default(0).notNull(),
  status: mysqlEnum("status", ["active", "onboarding", "paused", "offboarded"])
    .default("onboarding")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Client = typeof clients.$inferSelect;

/** Portal login accounts for client contacts (linked to a client) */
export const clientUsers = mysqlTable("client_users", {
  id: serial("id").primaryKey(),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  lastSignInAt: timestamp("lastSignInAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClientUser = typeof clientUsers.$inferSelect;

/** Philippines national holidays — shown in the client portal for awareness */
export const nationalHolidays = mysqlTable("national_holidays", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  date: varchar("date", { length: 32 }).notNull(), // ISO date
  type: mysqlEnum("type", ["regular", "special"]).default("regular").notNull(),
  note: varchar("note", { length: 500 }),
  year: int("year").notNull(),
});

export type NationalHoliday = typeof nationalHolidays.$inferSelect;

/** Training plans for a client's Ticker */
export const trainingPlans = mysqlTable("training_plans", {
  id: serial("id").primaryKey(),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["planned", "in_progress", "completed"])
    .default("planned")
    .notNull(),
  dueDate: varchar("dueDate", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrainingPlan = typeof trainingPlans.$inferSelect;

/** Messages between a client and their Ticky account manager */
export const portalMessages = mysqlTable("portal_messages", {
  id: serial("id").primaryKey(),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull(),
  senderType: mysqlEnum("senderType", ["client", "staff"]).notNull(),
  senderName: varchar("senderName", { length: 255 }),
  body: text("body").notNull(),
  readByStaff: timestamp("readByStaff"),
  readByClient: timestamp("readByClient"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortalMessage = typeof portalMessages.$inferSelect;

/** Social media profiles — managed in admin, rendered in the footer */
export const socialLinks = mysqlTable("social_links", {
  id: serial("id").primaryKey(),
  platform: mysqlEnum("platform", ["facebook", "instagram", "tiktok", "youtube", "linkedin", "x"]).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  label: varchar("label", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type SocialLink = typeof socialLinks.$inferSelect;

/** Blog posts — managed in admin under Marketing, rendered publicly at /blog */
export const posts = mysqlTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: varchar("excerpt", { length: 1000 }),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 1000 }),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  authorId: bigint("authorId", { mode: "number", unsigned: true }),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Post = typeof posts.$inferSelect;
