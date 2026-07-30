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
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
