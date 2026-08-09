export interface RoleCaseStudy {
  business: string
  quote: string
  result: string
  saving: string
}

export interface RoleDetail {
  slug: string
  heroIntro: string
  calibre: {
    intro: string
    points: string[]
  }
  offering: string
  idealFor: string[]
  caseStudy: RoleCaseStudy
}

export const roleDetails: Record<string, RoleDetail> = {
  telesales: {
    slug: 'telesales',
    heroIntro:
      'Outbound calling is the highest-leverage role to offshore first. A Ticky telesales representative or SDR works your scripts, your CRM and your business hours — booking qualified meetings for your closers at around 40% of the fully-loaded cost of a native hire.',
    calibre: {
      intro:
        'Filipino telesales professionals come from one of the world’s most mature contact-centre industries. The Philippines has spent three decades serving US, UK and Australian consumers on the phone — and it shows in the talent pool.',
      points: [
        'Degree-educated callers with neutral, western-standard accents — screened in live calls before shortlisting',
        'Typically 2+ years of outbound B2B or B2C campaign experience for western companies',
        'Tested on objection handling, call structure and CRM discipline against your specific brief',
        'Coached weekly by Ticky team leaders; call recordings available for your review',
        'Fluent in HubSpot, Salesforce, Aircall, Outreach and Apollo workflows',
      ],
    },
    offering:
      'Your telesales representative runs structured outbound campaigns: cold and warm calling, lead qualification, appointment setting, follow-up sequences and meticulous CRM hygiene. They work inside your dialling stack, attend your sales stand-ups over video, and report daily on dials, conversations and meetings booked. Part-time (20 hours) is a popular way to test a new market before committing to a full-time seat.',
    idealFor: [
      'B2B companies that need consistent top-of-funnel meetings',
      'Agencies and recruiters running business development campaigns',
      'Clinics and practices filling diaries through recall campaigns',
      'Founders still doing their own prospecting calls',
    ],
    caseStudy: {
      business: 'B2B SaaS scale-up, London',
      quote:
        'Our Ticky SDR books more qualified meetings than the two UK hires she replaced — at less than half the cost of one. The quality of English honestly surprised me.',
      result:
        'Within five days of the brief, three candidate videos were on the table. The chosen SDR outperformed two departed local hires within her first quarter, and a second sales seat followed.',
      saving: 'Saves over £38,000 per year',
    },
  },
  'sales-exec': {
    slug: 'sales-exec',
    heroIntro:
      'A Ticky sales executive or account manager runs discovery calls, demos and renewals in your time zone — an experienced revenue seat for roughly a third of the fully-loaded cost of hiring the same seniority locally.',
    calibre: {
      intro:
        'Senior sales talent is the Philippines’ best-kept secret: experienced closers who have spent careers selling to western markets for international companies, available without the western salary band.',
      points: [
        'Typically 4+ years of quota-carrying B2B sales or account management experience',
        'Interviewed live on discovery-call technique, demo delivery and pipeline management',
        'Experience selling into UK, US, Canadian, Australian and NZ markets specifically',
        'Comfortable in Salesforce, HubSpot, Pipedrive, Zoom and Gong environments',
        'Managed by Ticky team leaders with weekly pipeline and call-quality reviews',
      ],
    },
    offering:
      'Your sales executive owns real revenue responsibility: running discovery calls and product demos, managing and closing pipeline, handling renewals and expansion, and producing the forecasting and reporting your leadership needs. They join your sales meetings, carry your targets and work your CRM as a genuine member of the team — not a contractor on the edge of it.',
    idealFor: [
      'SaaS and services businesses that need closing capacity fast',
      'Companies with inbound leads that outpace their sales team',
      'Founder-led sales teams ready to hand over the calendar',
      'Businesses entering UK, US, Canadian, AU or NZ time zones',
    ],
    caseStudy: {
      business: 'E-commerce brand, Austin TX',
      quote:
        'We started with one part-time administrator as a test. Eighteen months later we have a team of five across sales support and marketing. It has completely changed our cost base.',
      result:
        'Sales support and account management moved offshore seat by seat as confidence grew. The team now runs on one monthly invoice with a dedicated account manager.',
      saving: 'Saves over $112,000 per year',
    },
  },
  admin: {
    slug: 'admin',
    heroIntro:
      'The office administrator is the backbone of every offshore programme: inbox, diary, data entry, documents and coordination — handled reliably, in perfect written English, from around £1,195 per month fully loaded.',
    calibre: {
      intro:
        'Filipino administrators are career professionals, not stopgaps. Many come from executive-support and back-office roles serving multinational companies, and treat organisation as a craft.',
      points: [
        'Degree-educated, with tested typing speeds, accuracy and software proficiency',
        'Experienced in Microsoft 365 and Google Workspace to an advanced standard',
        'Screened for written English with real business-document exercises',
        'Proactive communicators — trained to flag issues early rather than wait to be asked',
        'Background-checked, NDA-bound and working on managed, encrypted equipment',
      ],
    },
    offering:
      'Your administrator takes ownership of the operational day: inbox and diary management, data entry and CRM upkeep, document preparation and formatting, travel and meeting coordination, and supplier liaison. They work your hours, sit in your Slack or Teams, and become the person who simply makes things happen. Most clients start part-time and scale within months.',
    idealFor: [
      'Founders drowning in inbox and diary admin',
      'Agencies and practices with growing back-office workloads',
      'Sales teams that need CRM and proposal support',
      'Any business where skilled staff do unskilled admin',
    ],
    caseStudy: {
      business: 'Lettings agency, Leeds',
      quote:
        'Tenancy paperwork, invoicing, bank recs — it all just happens now. Our two Ticky administrators are the most dependable people in the business.',
      result:
        'Two administrators and a bookkeeper were placed over six weeks. The management layer checks quality before issues ever reach the branch team.',
      saving: 'Saves over £54,000 per year',
    },
  },
  marketing: {
    slug: 'marketing',
    heroIntro:
      'Marketing is where offshoring compounds fastest: a Ticky marketing executive executes campaigns, email, SEO and analytics every single day — the consistency local teams never quite sustain — from around £1,375 per month.',
    calibre: {
      intro:
        'The Philippines has a deep pool of marketing professionals trained by serving western brands directly. They arrive fluent in the platforms your business already runs on.',
      points: [
        'Hands-on experience with Mailchimp, HubSpot, WordPress, GA4 and Canva',
        'Portfolio-reviewed for campaign work delivered to western audiences',
        'Tested on written English, SEO fundamentals and analytics literacy',
        'Comfortable executing strategy set by your team or agency — brief to shipped, fast',
        'Managed and quality-checked by Ticky team leads with marketing backgrounds',
      ],
    },
    offering:
      'Your marketing executive runs the engine room: email campaigns and automation, SEO research and on-page updates, campaign reporting and analytics, landing page and CMS updates, and coordination with your designers or agencies. You set direction in a weekly call; they execute all week. It is the difference between marketing that happens and marketing that is always planned.',
    idealFor: [
      'Professional services firms whose marketing never gets done',
      'E-commerce brands needing consistent email and content output',
      'Agencies expanding delivery capacity inside retainers',
      'Founders who are the marketing department',
    ],
    caseStudy: {
      business: 'Professional services firm, Sydney',
      quote:
        'The onboarding was genuinely painless. Within two weeks our new marketing executive was running our email campaigns and social channels like she had been here for years.',
      result:
        'A local mid-weight hire quoted A$85k plus super; the Ticky executive onboarded in a fortnight with HubSpot and WordPress experience, and an EA followed a year later.',
      saving: 'Saves over A$73,000 per year',
    },
  },
  'customer-service': {
    slug: 'customer-service',
    heroIntro:
      'Customer service is the role the Philippines is world-famous for. A Ticky representative answers your phone, email and live chat with warmth and flawless English — from around £1,135 per month, fully loaded.',
    calibre: {
      intro:
        'The Philippines is the world’s contact-centre capital, serving the biggest western brands for decades. Ticky hires from the top of that talent pool and adds a management layer on top.',
      points: [
        'Neutral-accent, western-standard spoken English — screened in live scenario calls',
        'Experience across Zendesk, Intercom, Freshdesk, Shopify and Gorgias',
        'Trained on your macros, policies and brand voice before going live',
        'Empathy-first screening: patience and de-escalation tested, not assumed',
        'Quality monitored with ticket reviews and CSAT tracking by team leaders',
      ],
    },
    offering:
      'Your customer service representative handles phone, email and live chat support, ticket triage and resolution, order processing and refunds, and knowledge-base maintenance. They work your peak hours, hit your SLAs and report weekly on volume, resolution times and satisfaction. Coverage scales seat by seat as your volume grows.',
    idealFor: [
      'E-commerce and retail brands with growing ticket volumes',
      'SaaS companies needing tier-1 support coverage',
      'Clinics and practices losing bookings to unanswered phones',
      'Any business where response time is costing customers',
    ],
    caseStudy: {
      business: 'E-commerce brand, Austin TX',
      quote:
        'As a bootstrapped founder, I was doing customer emails at midnight and calling that a strategy. Within a month I had my evenings back.',
      result:
        'One part-time administrator grew into a five-person team handling all customer service, email marketing and back-office admin on a single invoice.',
      saving: 'Saves over $112,000 per year',
    },
  },
  bookkeeper: {
    slug: 'bookkeeper',
    heroIntro:
      'Ticky bookkeepers and accounts assistants bring qualified, software-tested capability to your reconciliations, invoicing and month-end — from around £1,200 per month fully loaded, under your review controls.',
    calibre: {
      intro:
        'The Philippines produces vast numbers of accounting graduates each year, many certified specifically on the platforms western firms run. Accuracy is screened, tested and then monitored.',
      points: [
        'Accounting or finance degrees, often with further certification',
        'Tested practically on Xero, QuickBooks, MYOB and Dext before shortlisting',
        'Experience with UK, US, Canadian, Australian and NZ chart-of-accounts conventions',
        'Detail-screened: reconciliation exercises with error-spotting as standard',
        'NDA-bound, working on managed equipment inside your security policies',
      ],
    },
    offering:
      'Your bookkeeper handles bank reconciliations and coding, invoicing, payables and receivables, expense processing and month-end support — prepared in your systems and reviewed by your team or external accountant. Practices use Ticky bookkeepers as processing capacity; businesses use them as their day-to-day finance function.',
    idealFor: [
      'Accounting practices needing seasonal or year-round capacity',
      'Businesses whose bookwork is always a month behind',
      'Founders still doing their own reconciliations',
      'Finance teams that need processing power, not more seniors',
    ],
    caseStudy: {
      business: 'Four-partner accounting practice, Denver',
      quote:
        'Tax season used to mean turning away work. This year our two Ticky bookkeepers cleared the backlog — and their Xero and QuickBooks skills were better than advertised.',
      result:
        'Started as a one-seat tax-season trial; now two bookkeepers and an executive assistant work US Central hours inside the firm’s practice software.',
      saving: 'Saves over $67,000 per year',
    },
  },
  ea: {
    slug: 'ea',
    heroIntro:
      'A Ticky executive assistant is a proactive right hand for founders and directors — complex diaries, inboxes, travel, research and gatekeeping, done to a western executive standard from around £1,430 per month.',
    calibre: {
      intro:
        'Executive support is a senior profession in the Philippines, with career EAs who have supported C-suite leaders at multinational companies for years.',
      points: [
        'Typically 4+ years supporting directors, founders or C-suite executives',
        'Advanced calendar, inbox and travel coordination across time zones',
        'Interviewed for judgement, discretion and anticipation — the EA intangibles',
        'Fluent in Google Workspace, Microsoft 365, Calendly, Slack and Zoom',
        'NDA-bound with enforceable confidentiality as standard',
      ],
    },
    offering:
      'Your executive assistant runs the complexity around you: complex diary and inbox management, travel and meeting coordination, research, briefing documents and reporting, plus personal and business task support. They learn your preferences fast, guard your time ruthlessly and make your week feel organised again.',
    idealFor: [
      'Founders and MDs whose diary runs them',
      'Consultants and partners losing billable hours to admin',
      'Executives splitting time across time zones',
      'Anyone who has said "I need a clone" this month',
    ],
    caseStudy: {
      business: 'Professional services firm, Sydney',
      quote:
        'A year in, we added an executive assistant through Ticky as well. The standard has never once felt like a compromise.',
      result:
        'The EA joined after the marketing executive proved the model. Combined, both roles cost about A$3,700 a month against a realistic A$9,800 locally.',
      saving: 'Saves over A$73,000 per year',
    },
  },
  social: {
    slug: 'social',
    heroIntro:
      'A Ticky social media and content specialist keeps your channels alive every single day — calendars planned a month ahead, graphics and video produced daily — from around £1,315 per month fully loaded.',
    calibre: {
      intro:
        'Filipino content specialists grow up in one of the world’s most social-media-engaged countries, and the professionals we place pair that instinct with agency-grade discipline.',
      points: [
        'Portfolio-reviewed: real content produced for western brands and agencies',
        'Skilled in Canva, CapCut, Hootsuite, Buffer and the Meta Business Suite',
        'Copywriting tested against brand-voice exercises in native-standard English',
        'Trend-aware but process-driven: calendars, approvals and reporting built in',
        'Many arrive with direct agency experience serving AU, UK and US clients',
      ],
    },
    offering:
      'Your specialist owns the content engine: content calendars and scheduling, copywriting and graphic creation, short-form video editing, community management and engagement, and performance tracking with monthly reporting. Your channels stop going quiet the moment client work gets busy — which is exactly when they matter most.',
    idealFor: [
      'Agencies whose clients demand daily content',
      'Brands with great products and silent channels',
      'Founders doing Canva at midnight',
      'Businesses that need video editing capacity weekly',
    ],
    caseStudy: {
      business: 'Creative agency, Melbourne',
      quote:
        'Ticky matched us with Bianca, who had already worked for two Australian agencies. Our engagement has tripled and inbound enquiries are noticeably up.',
      result:
        'She works Melbourne hours, sits in the agency Slack and runs the content calendar a month ahead. An administrator followed six months later.',
      saving: 'Saves over A$39,000 per year',
    },
  },
}

export function getRoleDetail(slug: string) {
  return roleDetails[slug]
}
