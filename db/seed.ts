import { getDb } from "../api/queries/connection";
import { reviews, enquiries, analyticsEvents, pages } from "./schema";
import { sql } from "drizzle-orm";

const seedReviews = [
  {
    slug: "james",
    name: "James Whitfield",
    role: "Managing Director",
    company: "Clearpath Analytics",
    location: "London, UK",
    industry: "B2B SaaS",
    hires: ["Telesales / SDR", "Sales Executive"],
    saving: "£38,000 / year",
    rating: 5,
    headline: "Books more meetings than the two UK hires she replaced",
    quote:
      "Our Ticky SDR books more qualified meetings than the two UK hires she replaced — at less than half the cost of one. The quality of English honestly surprised me.",
    story: [
      "We were sceptical. We had tried a freelance VA before and it ended in missed calls and garbled emails, so the bar for Ticky was high. Our discovery call changed the tone completely — within five days we had three candidate videos, and each one spoke clearer, more confident English than some of the people we had interviewed locally.",
      "We hired Angela as our SDR on a full-time basis, working 9am to 5:30pm UK time. Her first two weeks were spent in our HubSpot instance learning our ICP, and by week three she was on the phones. She now books 12–15 qualified demos a month — more than the two UK-based SDRs we had previously employed combined.",
      "The maths is hard to argue with: we were spending roughly £6,400 a month fully loaded on two average performers. Angela costs us £1,385, outperforms both of them, and Ticky handles every HR and admin headache. We have since added a second sales executive and recommended them to two other founders in our network.",
    ],
    photo: "/images/review-james.jpg",
    status: "published" as const,
    sortOrder: 1,
  },
  {
    slug: "sarah",
    name: "Sarah Delaney",
    role: "Founder & CEO",
    company: "Bloom & Co",
    location: "Austin, TX",
    industry: "E-commerce",
    hires: ["Office Administrator", "Marketing Executive", "Customer Service × 3"],
    saving: "$112,000 / year",
    rating: 5,
    headline: "From one part-timer to a team of five in eighteen months",
    quote:
      "We started with one part-time administrator as a test. Eighteen months later we have a team of five across sales support and marketing. It has completely changed our cost base.",
    story: [
      "As a bootstrapped founder, I was doing customer emails at midnight and calling that a strategy. I gave Ticky the smallest possible brief: a part-time administrator, 20 hours a week, to take over my inbox and order admin. Within a month I had my evenings back.",
      "The part-time test is what sold me on the model. There was no pressure to scale, no pushy account manager — but once I saw the quality, scaling was the obvious move. Today our Ticky team handles all customer service, our email marketing, and back-office admin. Five people, one invoice, roughly $5,700 a month.",
      "For context, hiring those five roles locally in Austin would run well over $15,000 a month before benefits. That delta is the difference between us reinvesting in product and inventory, or standing still. The team works US Central hours, joins our Slack like any employee, and our customers have no idea they are 8,000 miles away.",
    ],
    photo: "/images/review-sarah.jpg",
    status: "published" as const,
    sortOrder: 2,
  },
  {
    slug: "michael",
    name: "Michael Tran",
    role: "Director",
    company: "Meridian Advisory Group",
    location: "Sydney, AU",
    industry: "Professional Services",
    hires: ["Marketing Executive", "Executive Assistant"],
    saving: "A$74,000 / year",
    rating: 5,
    headline: "Running our marketing like she had been here for years",
    quote:
      "The onboarding was genuinely painless. Within two weeks our new marketing executive was running our email campaigns and social channels like she had been here for years.",
    story: [
      "Professional services firms live and die on staying visible, but a mid-weight marketing hire in Sydney was quoting A$85k plus super. We could not justify it, so marketing simply was not getting done. Ticky presented three candidates within a week, all with genuine HubSpot and WordPress experience.",
      "We chose Katrina, and the onboarding genuinely was painless. Ticky had her set up on managed equipment with our VPN and 2FA policies before day one. By the end of week two she owned our email calendar, LinkedIn presence and monthly newsletter. I review; she executes.",
      "A year in, we added an executive assistant through Ticky as well. Combined, the two roles cost us about A$3,700 a month against a realistic A$9,800 locally — and the standard has never once felt like a compromise. I tell every firm owner I know: this is the easiest margin improvement you will ever make.",
    ],
    photo: "/images/review-michael.jpg",
    status: "published" as const,
    sortOrder: 3,
  },
  {
    slug: "emma",
    name: "Emma Callaghan",
    role: "Head of Operations",
    company: "Northgate Properties",
    location: "Manchester, UK",
    industry: "Real Estate",
    hires: ["Office Administrator × 2", "Bookkeeper"],
    saving: "£46,000 / year",
    rating: 5,
    headline: "Our back office finally runs itself",
    quote:
      "Tenancy paperwork, invoicing, bank recs — it all just happens now. Our two Ticky administrators are the most dependable people in the business.",
    story: [
      "We manage 400+ rental units and the admin was drowning our lettings team: tenancy agreements, deposit registrations, contractor invoices, endless reconciliation. Hiring locally at £28–32k per administrator, on Manchester wages, was eating our management fees alive.",
      "Ticky placed two administrators and a bookkeeper with us over about six weeks. The difference from our previous outsourcing experience is the management layer — their team leaders check quality before we ever see an issue, and the monthly reporting means I always know what got done.",
      "Eight months later, our lettings negotiators spend their time on viewings and landlords, not paperwork. Error rates on our invoicing are down, and we are saving about £46k a year against local hiring. The team works 9–5:30 UK hours and are on our phones and CRM like they sit in the next room.",
    ],
    photo: "/images/review-emma.jpg",
    status: "published" as const,
    sortOrder: 4,
  },
  {
    slug: "david",
    name: "David Rosenbaum",
    role: "Founder",
    company: "Rosenbaum & Associates CPA",
    location: "Chicago, IL",
    industry: "Accounting",
    hires: ["Bookkeeper × 2", "Executive Assistant"],
    saving: "$96,000 / year",
    rating: 5,
    headline: "I extended our capacity without a single local hire",
    quote:
      "Tax season used to mean turning away work. This year our two Ticky bookkeepers cleared the backlog — and their Xero and QuickBooks skills were better than advertised.",
    story: [
      "I have run a CPA firm for twenty years, so believe me when I say I do not hand my clients' books to anyone lightly. What convinced me was the vetting: skills tests on QuickBooks and Xero, spoken English assessment, background checks — all documented before I ever interviewed.",
      "We started with one bookkeeper during tax season as a trial. The work came back clean, coded correctly, and on deadline. We now have two bookkeepers and an executive assistant through Ticky, all working US Central hours, all inside our practice management software under our security policies.",
      "The economics speak for themselves — about $96,000 a year saved against Chicago salaries — but the real story is capacity. We took on 30% more clients this year without a single local hire, and my senior staff finally spend their time on advisory work instead of data entry.",
    ],
    photo: "/images/review-david.jpg",
    status: "published" as const,
    sortOrder: 5,
  },
  {
    slug: "rachel",
    name: "Rachel Simmons",
    role: "Chief Executive",
    company: "Luminary Events",
    location: "Melbourne, AU",
    industry: "Events & Hospitality",
    hires: ["Social Media & Content Specialist", "Office Administrator"],
    saving: "A$68,000 / year",
    rating: 5,
    headline: "Every channel active, every day, without me asking",
    quote:
      "Our Instagram, LinkedIn and TikTok are finally consistent. Bianca plans a month of content ahead and our engagement has tripled. I barely think about it anymore.",
    story: [
      "Events is a visibility business, but between running events I was posting on social media at 11pm and calling it marketing. A content hire in Melbourne wanted A$75k+, which for a business our size was a genuine stretch.",
      "Ticky matched us with Bianca, a social media specialist who had already worked for two Australian agencies. She works Melbourne hours, sits in our Slack, and runs our content calendar a month ahead — Canva graphics, CapCut video edits, the lot. Our engagement has tripled and inbound enquiries are noticeably up.",
      "We added an administrator six months later for supplier coordination and run-sheets. The two roles together cost less than one local junior salary. The professionalism of the Ticky management layer — the reviews, the reporting, the replacement guarantee — is what makes this feel low-risk rather than too good to be true.",
    ],
    photo: "/images/review-rachel.jpg",
    status: "published" as const,
    sortOrder: 6,
  },
];

const seedEnquiries = [
  {
    name: "Tom Ashworth",
    company: "Ashworth Digital",
    email: "tom@ashworthdigital.co.uk",
    phone: "+44 7700 900123",
    roleInterest: "Telesales / SDR",
    hours: "full" as const,
    message:
      "We need an outbound caller to book demos for our recruitment software, UK hours. Looking to start in the next month.",
    status: "new" as const,
  },
  {
    name: "Priya Nair",
    company: "Harbor Lane Realty",
    email: "priya@harborlane.com.au",
    roleInterest: "Office Administrator",
    hours: "part" as const,
    message: "Part-time admin support for our property management team — inbox, listings, tenancy paperwork.",
    status: "contacted" as const,
  },
  {
    name: "Mark Sullivan",
    company: "Sullivan Tax Group",
    email: "mark@sullivantax.com",
    roleInterest: "Bookkeeper / Accounts Assistant",
    hours: "full" as const,
    message: "Two bookkeepers needed for busy season, QuickBooks experience essential.",
    status: "qualified" as const,
  },
];

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  const [{ reviewCount }] = await db
    .select({ reviewCount: sql<number>`count(*)` })
    .from(reviews);

  if (Number(reviewCount) === 0) {
    await db.insert(reviews).values(
      seedReviews.map((r) => ({
        ...r,
        hires: JSON.stringify(r.hires),
        story: JSON.stringify(r.story),
      })),
    );
    console.log(`Inserted ${seedReviews.length} reviews`);
  } else {
    console.log("Reviews already seeded, skipping");
  }

  const [{ enquiryCount }] = await db
    .select({ enquiryCount: sql<number>`count(*)` })
    .from(enquiries);

  if (Number(enquiryCount) === 0) {
    await db.insert(enquiries).values(seedEnquiries);
    console.log(`Inserted ${seedEnquiries.length} sample enquiries`);
  } else {
    console.log("Enquiries already exist, skipping");
  }

  const [{ pageCount }] = await db.select({ pageCount: sql<number>`count(*)` }).from(pages);
  if (Number(pageCount) === 0) {
    await db.insert(pages).values({
      slug: "why-outsource-to-the-philippines",
      title: "Why Outsource to the Philippines? A Straight-Talking Guide for SMEs",
      excerpt:
        "The real economics, the cultural fit, and the mistakes to avoid when building your first offshore team.",
      content: `## The short version\n\nThe Philippines combines western-standard English, a service-oriented culture and labour costs roughly 50–70% below the UK, US and Australia. It is why over 1.3 million Filipinos work in the outsourcing industry.\n\n## What makes it work\n\n- **English as an official language** — business, law and higher education all run in English.\n- **Cultural alignment** — decades of close ties with western markets mean your customers notice no difference.\n- **Time-zone flexibility** — a mature night-shift culture covers UK, US and AU business hours.\n\n## The mistakes to avoid\n\n1. Hiring freelancers with no management layer.\n2. Treating offshore staff as tasks rather than team members.\n3. Skipping structured onboarding.\n\nTicky exists to solve all three — we employ, equip, train and manage your team so you get the output without the overhead.`,
      status: "published" as const,
    });
    console.log("Inserted 1 sample page");
  }

  // a little analytics history so the dashboard chart isn't empty
  const [{ eventCount }] = await db
    .select({ eventCount: sql<number>`count(*)` })
    .from(analyticsEvents);
  if (Number(eventCount) === 0) {
    const paths = ["/", "/", "/", "/roles", "/reviews", "/how-it-works", "/contact"];
    const rows: { type: "pageview"; path: string; referrer: string | null; userAgent: string; createdAt: Date }[] = [];
    for (let d = 29; d >= 0; d--) {
      const views = 3 + Math.floor(Math.random() * 14);
      for (let v = 0; v < views; v++) {
        rows.push({
          type: "pageview",
          path: paths[Math.floor(Math.random() * paths.length)],
          referrer: Math.random() > 0.5 ? "google.com" : null,
          userAgent: "seed",
          createdAt: new Date(Date.now() - d * 86400000 - Math.floor(Math.random() * 80000000)),
        });
      }
    }
    await db.insert(analyticsEvents).values(rows);
    console.log(`Inserted ${rows.length} sample analytics events`);
  }

  console.log("Done.");
  process.exit(0);
}

seed();
