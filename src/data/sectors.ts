export interface SectorCaseStudy {
  business: string
  challenge: string
  result: string
  saving: string
}

export interface Sector {
  slug: string
  businessNoun: string
  name: string
  shortName: string
  tagline: string
  heroIntro: string
  overview: string[]
  benefits: { title: string; text: string }[]
  exampleRoles: { roleId: string; note: string }[]
  savingsNote: string
  caseStudy: SectorCaseStudy
}

export const sectors: Sector[] = [
  {
    slug: 'recruitment-staffing',
    businessNoun: 'recruitment agencies',
    name: 'Recruitment & Staffing',
    shortName: 'Recruitment',
    tagline: 'Scale your desk without scaling your payroll',
    heroIntro:
      'Recruitment agencies live on margin per placement. Offshoring resourcing, admin and candidate care to the Philippines lets your consultants spend their day billing — not formatting CVs.',
    overview: [
      'The recruitment industry runs on volume: sourcing, screening, scheduling and CRM hygiene consume hours that consultants should spend with clients and candidates. Agencies across the UK, US, Canada, Australia and New Zealand are moving that workload to dedicated offshore teams in the Philippines — and protecting their margins in the process.',
      'Ticky Global supplies degree-educated Filipino professionals with genuine recruitment-industry experience: candidate resourcers who know Boolean search, administrators fluent in Bullhorn, Vincere and JobAdder, and telesales callers who can open doors for your business development team. All work your exact business hours with western-standard written and spoken English.',
    ],
    benefits: [
      {
        title: 'More consultant selling time',
        text: 'Offshore resourcers handle sourcing, first-stage screening and interview scheduling so your billers spend their day on revenue conversations.',
      },
      {
        title: 'A CRM that finally stays clean',
        text: 'Dedicated administrators keep candidate records, notes and compliance documents current — the unglamorous work that decides fill rates.',
      },
      {
        title: 'Business development at scale',
        text: 'Trained telesales callers run structured BD campaigns, booking qualified client meetings for your consultants at a fraction of local cost.',
      },
      {
        title: 'Margin protection in slow markets',
        text: 'When placement volumes dip, a 60% lower back-office cost base is the difference between a lean quarter and a loss-making one.',
      },
    ],
    exampleRoles: [
      { roleId: 'telesales', note: 'BD calling, candidate outreach and lead qualification' },
      { roleId: 'admin', note: 'CRM hygiene, compliance documents and interview scheduling' },
      { roleId: 'marketing', note: 'Job adverts, LinkedIn campaigns and talent-pool nurturing' },
    ],
    savingsNote:
      'A native resourcer or recruitment administrator typically costs £2,800–£3,200 (US$3,900–4,500) per month fully loaded. The same role through Ticky starts from around £1,315 / US$1,665 — a saving of roughly 55–60% per seat, every month.',
    caseStudy: {
      business: 'A 12-consultant boutique agency in Manchester',
      challenge:
        'Consultants were spending 40% of their week on sourcing admin and CRM updates, and two local resourcers cost more than £6,000 a month combined.',
      result:
        'Two Ticky resourcers and one administrator now run sourcing, scheduling and CRM hygiene overnight-ready for each UK morning. Consultant billing time rose by a third within one quarter.',
      saving: 'Saves over £48,000 per year',
    },
  },
  {
    slug: 'accounting-finance',
    businessNoun: 'accounting firms',
    name: 'Accounting & Finance',
    shortName: 'Accounting',
    tagline: 'Clear the backlog without the local salary bill',
    heroIntro:
      'Accounting firms face a structural talent shortage and seasonal workload spikes. Qualified Filipino bookkeepers and accounts assistants absorb the routine work so your seniors can focus on advisory.',
    overview: [
      'The Philippines produces hundreds of thousands of accounting graduates every year, many trained specifically on Xero, QuickBooks and MYOB for western firms. It has become the natural extension of practices in the UK, US, Canada, Australia and New Zealand that need capacity without committing to local senior salaries.',
      'Ticky Global places bookkeepers and accounts assistants who work inside your practice management software, under your security policies and review controls. Bank reconciliations, coding, payables, receivables and month-end support — completed in your time zone and ready for partner review each morning.',
    ],
    benefits: [
      {
        title: 'Seasonal surge capacity',
        text: 'Scale bookkeeping capacity up for tax season and back down afterwards, without hiring cycles or redundancies.',
      },
      {
        title: 'Senior time back for advisory',
        text: 'Routine processing moves offshore, so your qualified staff can sell and deliver higher-margin advisory work.',
      },
      {
        title: 'Software-fluent from day one',
        text: 'Candidates are tested on Xero, QuickBooks, MYOB and Dext before they reach your shortlist — no months of platform training.',
      },
      {
        title: 'Your controls, your sign-off',
        text: 'Work is prepared offshore and reviewed by your team onshore. You keep professional responsibility; you lose the processing cost.',
      },
    ],
    exampleRoles: [
      { roleId: 'bookkeeper', note: 'Reconciliations, coding, AP/AR and month-end support' },
      { roleId: 'admin', note: 'Client onboarding packs, document chase and practice admin' },
      { roleId: 'customer-service', note: 'First-line client queries and document collection' },
    ],
    savingsNote:
      'A fully-loaded native bookkeeper costs roughly £3,100 (US$4,300 / C$5,500 / A$5,800) per month. A Ticky bookkeeper starts from around £1,320 / US$1,700 — typically a 55–60% saving that compounds with every seat you add.',
    caseStudy: {
      business: 'A four-partner practice in Denver, Colorado',
      challenge:
        'Tax season meant turning away work. Local hiring was slow, and interim staff cost more than the fees they generated.',
      result:
        'Two Ticky bookkeepers cleared a six-week backlog in their first month and now handle year-round processing. The practice accepted 15% more clients this year without adding local headcount.',
      saving: 'Saves over $67,000 per year',
    },
  },
  {
    slug: 'real-estate-property',
    businessNoun: 'property businesses',
    name: 'Real Estate & Property',
    shortName: 'Real Estate',
    tagline: 'Win more instructions while admin runs itself',
    heroIntro:
      'Estate agencies and property managers are drowning in tenancy paperwork, listing admin and enquiry handling. Offshore teams take it on — accurately, cheerfully and at half the cost.',
    overview: [
      'Property is a relationship business wrapped in an administrative avalanche: tenancy agreements, deposit protection, maintenance coordination, listing updates, portal uploads and endless email chains. Agencies across the UK, US, Canada, Australia and New Zealand use Filipino teams to carry that load.',
      'Ticky Global supplies office administrators, customer service representatives and marketing support who already understand the rhythms of agency life — AML checks, reference chasing, tenancy progression and landlord reporting — working your local business hours with clear, professional English on every call and email.',
    ],
    benefits: [
      {
        title: 'Tenancy progression that never stalls',
        text: 'Offshore administrators chase references, prepare agreements and track every file to completion — bottlenecks disappear.',
      },
      {
        title: 'Every enquiry answered fast',
        text: 'Dedicated customer service staff handle applicant and tenant enquiries on phone, email and portal messages within minutes, not days.',
      },
      {
        title: 'Listings always fresh',
        text: 'Property descriptions written, photos uploaded and portals updated daily — your window stays full without negotiator overtime.',
      },
      {
        title: 'Predictable branch costs',
        text: 'One monthly invoice replaces the creeping cost of local admin salaries, holiday cover and recruitment churn.',
      },
    ],
    exampleRoles: [
      { roleId: 'admin', note: 'Tenancy paperwork, referencing and compliance tracking' },
      { roleId: 'customer-service', note: 'Applicant, tenant and landlord enquiry handling' },
      { roleId: 'social', note: 'Property showcases, area guides and channel growth' },
    ],
    savingsNote:
      'Two native administrators cost around £5,600 (US$7,800 / A$10,600) per month fully loaded. The same two seats through Ticky start from roughly £2,630 / US$3,330 — an annual saving that can exceed £35,000 per branch.',
    caseStudy: {
      business: 'A three-branch lettings agency in Leeds',
      challenge:
        'Tenancy paperwork, invoicing and bank reconciliations consumed the branch team, and a previous outsourcing attempt had failed on quality control.',
      result:
        'Two Ticky administrators and a bookkeeper now run the back office with a management layer that checks quality before it reaches the branch. The agency calls them "the most dependable people in the business".',
      saving: 'Saves over £54,000 per year',
    },
  },
  {
    slug: 'ecommerce-retail',
    businessNoun: 'e-commerce brands',
    name: 'E-commerce & Retail',
    shortName: 'E-commerce',
    tagline: 'Delight customers and protect thin margins',
    heroIntro:
      'Online retail runs on customer experience and operational pace. Filipino support teams answer tickets, process orders and keep your content engine running — for around 40% of the local cost.',
    overview: [
      'E-commerce margins leave no room for bloated overheads, yet customers expect instant answers on chat, email and social. Brands across the UK, US, Canada, Australia and New Zealand increasingly serve those customers with Philippine-based teams — the same model the world’s largest retailers have used for two decades.',
      'Ticky Global builds e-commerce support teams fluent in Shopify, Gorgias, Zendesk and Klaviyo: customer service representatives who resolve tickets in your brand voice, administrators who keep orders and supplier admin moving, and content specialists who keep your channels selling while you sleep.',
    ],
    benefits: [
      {
        title: 'Coverage across time zones',
        text: 'Serve customers during your peak hours — and wake up to cleared inboxes — with teams built for shift work.',
      },
      {
        title: 'Brand-voice support at scale',
        text: 'Representatives are trained on your macros, tone and policies, then quality-checked by a local management layer.',
      },
      {
        title: 'Operations that keep pace',
        text: 'Order processing, refunds, supplier coordination and product uploads handled daily, without local salary inflation.',
      },
      {
        title: 'Content that compounds',
        text: 'Social and email specialists keep acquisition channels active — the work that slips when founders get busy.',
      },
    ],
    exampleRoles: [
      { roleId: 'customer-service', note: 'Tickets, live chat, refunds and order queries' },
      { roleId: 'admin', note: 'Order admin, supplier coordination and product uploads' },
      { roleId: 'ppc', note: 'Google Shopping, Meta and Amazon ad management' },
    ],
    savingsNote:
      'A native customer service representative costs around £2,600 (US$3,600 / C$4,700) per month fully loaded. Through Ticky the same seat starts from roughly £1,250 / US$1,590 — a saving of 50%+ that scales linearly as your ticket volume grows.',
    caseStudy: {
      business: 'A bootstrapped DTC brand in Austin, Texas',
      challenge:
        'The founder was answering customer emails at midnight. Growth had stalled because every hour went into operations instead of marketing.',
      result:
        'Started with one part-time Ticky administrator; eighteen months later a five-person offshore team runs all customer service, email marketing and back-office admin — on one monthly invoice.',
      saving: 'Saves over $112,000 per year',
    },
  },
  {
    slug: 'legal-professional-services',
    businessNoun: 'professional services firms',
    name: 'Legal & Professional Services',
    shortName: 'Legal & Professional',
    tagline: 'Bill more hours, buy back the admin',
    heroIntro:
      'Law firms, consultancies and professional practices sell expertise by the hour. Every non-billable admin hour is revenue lost — offshore support teams give those hours back.',
    overview: [
      'Professional services firms run on utilisation. Yet fee earners routinely lose hours to document formatting, diary management, client onboarding, billing support and marketing that never quite happens. Offshore teams in the Philippines absorb that workload with the discretion and polish professional clients expect.',
      'Ticky Global places executive assistants, administrators and marketing executives with professional-services experience: matter opening and file management, client intake, document production, CRM upkeep and the marketing execution partners never have time for — all under strict confidentiality with enforceable NDAs and managed, encrypted equipment.',
    ],
    benefits: [
      {
        title: 'More billable hours per fee earner',
        text: 'Document production, file admin and diary management move offshore — fee earners bill instead of formatting.',
      },
      {
        title: 'A polished client experience',
        text: 'Intake calls, onboarding packs and status updates handled promptly and professionally in native-standard English.',
      },
      {
        title: 'Marketing that actually ships',
        text: 'Newsletters, LinkedIn presence and event follow-up executed consistently by a dedicated marketing executive.',
      },
      {
        title: 'Confidentiality by design',
        text: 'NDAs, role-based access, 2FA and your own VPN or VDI — we work inside your compliance framework, including GDPR.',
      },
    ],
    exampleRoles: [
      { roleId: 'ea', note: 'Partner diaries, travel, research and gatekeeping' },
      { roleId: 'admin', note: 'Matter admin, document production and billing support' },
      { roleId: 'marketing', note: 'Newsletters, LinkedIn and campaign execution' },
    ],
    savingsNote:
      'A native executive assistant or legal administrator costs £2,800–£3,500 (A$5,300–6,600) per month fully loaded. Ticky equivalents start from around £1,315–£1,575 / A$2,495–3,030 — typically a 50–55% saving per seat.',
    caseStudy: {
      business: 'A professional services firm in Sydney',
      challenge:
        'A mid-weight marketing hire quoted A$85k plus super — unaffordable — so marketing simply was not getting done and visibility was slipping.',
      result:
        'A Ticky marketing executive onboarded in two weeks, running the email calendar, LinkedIn and newsletter within a fortnight. An executive assistant followed a year later.',
      saving: 'Saves over A$73,000 per year',
    },
  },
  {
    slug: 'healthcare-medical',
    businessNoun: 'healthcare practices',
    name: 'Healthcare & Medical Practices',
    shortName: 'Healthcare',
    tagline: 'Front-desk excellence without front-desk costs',
    heroIntro:
      'Clinics and practices lose patients to unanswered phones and slow admin. Offshore patient coordinators and administrators keep diaries full and records tidy — at a cost private practices can actually sustain.',
    overview: [
      'Dental practices, physio clinics, veterinary groups and private medical practices share the same problem: the phones never stop, the diary is a jigsaw, and the administrative load grows with every clinician added. Philippine-based patient coordinators solve it — with the warmth and clear English patients expect.',
      'Ticky Global supplies administrators and customer service specialists experienced in appointment scheduling, recall campaigns, insurance and billing queries, and patient communications. They work your practice hours, inside your practice management systems, under strict confidentiality and access controls.',
    ],
    benefits: [
      {
        title: 'Every call answered',
        text: 'Dedicated patient coordinators answer enquiries, book appointments and manage cancellations — no more voicemail lost revenue.',
      },
      {
        title: 'Recalls and reactivations',
        text: 'Structured outbound campaigns fill hygiene diaries and reactivate lapsed patients — pure incremental revenue.',
      },
      {
        title: 'Billing and insurance admin',
        text: 'Claims support, invoice queries and payment chasing handled methodically, improving cash flow.',
      },
      {
        title: 'Clinician time protected',
        text: 'Practitioners treat patients while the diary, inbox and paperwork are managed for them.',
      },
    ],
    exampleRoles: [
      { roleId: 'customer-service', note: 'Patient enquiries, bookings and diary management' },
      { roleId: 'admin', note: 'Records, billing support and insurance admin' },
      { roleId: 'telesales', note: 'Recall campaigns and treatment follow-ups' },
    ],
    savingsNote:
      'A native medical receptionist or patient coordinator costs around £2,600 (US$3,600 / NZ$5,500) per month fully loaded. Through Ticky the same seat starts from roughly £1,250 / US$1,590 — a saving of around 50% per seat.',
    caseStudy: {
      business: 'A two-site dental group in Auckland',
      challenge:
        'Front-desk staff were overwhelmed; unanswered calls were estimated to cost several bookings a day, and local cover was unaffordable.',
      result:
        'Two Ticky patient coordinators now answer every call, run recall campaigns and manage both diaries. Missed-call losses effectively ended in the first month.',
      saving: 'Saves over NZ$79,000 per year',
    },
  },
  {
    slug: 'it-software',
    businessNoun: 'software companies',
    name: 'IT & Software Companies',
    shortName: 'IT & Software',
    tagline: 'Scale the functions around your engineers',
    heroIntro:
      'Software companies offshore support, sales development and operations so expensive engineers stay on the roadmap. It is the operating model the industry was built on.',
    overview: [
      'SaaS and IT businesses already think globally — their customers do. The functions that surround engineering (customer support, sales development, marketing operations and administration) are exactly the ones that scale best from the Philippines, in your customers’ time zones.',
      'Ticky Global builds teams for software companies: SDRs who book qualified demos, support representatives who clear tickets in Zendesk or Intercom, marketing executives who run the funnel, and administrators who keep operations humming — all fluent in the SaaS toolset and comfortable with startup pace.',
    ],
    benefits: [
      {
        title: 'Pipeline without payroll shock',
        text: 'SDR teams book qualified meetings at around 40% of the fully-loaded cost of a local hire — CAC falls, coverage rises.',
      },
      {
        title: 'Support that scales with ARR',
        text: 'Ticket handling, triage and knowledge-base upkeep grow seat by seat, exactly in step with your customer base.',
      },
      {
        title: 'Engineers stay on the roadmap',
        text: 'Internal admin, reporting and coordination move offshore — senior technical staff stop context-switching.',
      },
      {
        title: 'Follow-the-sun coverage',
        text: 'Philippine teams cover your customers’ business hours in any market, with shift culture built in.',
      },
    ],
    exampleRoles: [
      { roleId: 'telesales', note: 'Outbound SDR campaigns and demo booking' },
      { roleId: 'customer-service', note: 'Tier-1 support, triage and knowledge base' },
      { roleId: 'marketing', note: 'Email nurture, SEO upkeep and analytics' },
    ],
    savingsNote:
      'A native SDR costs roughly £3,200 (US$4,500 / C$5,800) per month fully loaded. A Ticky SDR starts from around £1,525 / US$1,940 — meaning two offshore SDRs cost little more than one local hire, with management included.',
    caseStudy: {
      business: 'A B2B SaaS scale-up in London',
      challenge:
        'Two underperforming local SDRs cost £6,400 a month fully loaded, and pipeline targets were being missed every quarter.',
      result:
        'A single Ticky SDR now books more qualified meetings than both predecessors combined. The company added a second sales executive and recommended Ticky to two other founders.',
      saving: 'Saves over £38,000 per year',
    },
  },
  {
    slug: 'marketing-creative-agencies',
    businessNoun: 'marketing agencies',
    name: 'Marketing & Creative Agencies',
    shortName: 'Agencies',
    tagline: 'More client capacity, same headcount budget',
    heroIntro:
      'Agencies win on talent and lose on utilisation. Offshore content, design support and account admin expand what each retainer can deliver — and what each client is worth.',
    overview: [
      'Agency economics are brutal: retainers are fixed, scope creep is constant and local mid-weight salaries keep climbing. Agencies across the UK, US, Canada, Australia and New Zealand use Philippine-based specialists to expand delivery capacity inside existing retainers.',
      'Ticky Global places social media and content specialists, marketing executives and administrators with agency backgrounds — people who have worked to western brand guidelines, hit publishing deadlines and lived inside Asana, Slack and the Meta suite. Your account managers direct; the offshore team executes.',
    ],
    benefits: [
      {
        title: 'Retainers that stay profitable',
        text: 'Content production, scheduling and reporting move offshore — scope creep stops eating your margin.',
      },
      {
        title: 'Daily content, every client',
        text: 'Calendars planned a month ahead, graphics produced daily, channels never left quiet.',
      },
      {
        title: 'Account admin handled',
        text: 'Reporting, deck formatting, meeting notes and traffic management — the glue work that buries account managers.',
      },
      {
        title: 'Capacity on demand',
        text: 'Add a part-time specialist for a pitch or seasonal client without committing to a full local salary.',
      },
    ],
    exampleRoles: [
      { roleId: 'social', note: 'Content calendars, Canva graphics, CapCut edits, scheduling' },
      { roleId: 'ppc', note: 'Google, Meta and Amazon campaign builds and optimisation' },
      { roleId: 'admin', note: 'Traffic management, deck formatting and account admin' },
    ],
    savingsNote:
      'A native PPC or paid-media specialist costs around £3,800 (US$5,300 / A$7,000) per month fully loaded. Ticky specialists start from roughly £1,645 / US$2,085 — letting agencies add senior delivery capacity for less than half the local cost.',
    caseStudy: {
      business: 'A creative agency in Melbourne',
      challenge:
        'Client demand for daily content was growing but a local content hire was unaffordable; founders were doing Canva work at night.',
      result:
        'A Ticky social media specialist (who had already worked for two Australian agencies) now runs the content calendar a month ahead. Engagement tripled and inbound enquiries rose noticeably.',
      saving: 'Saves over A$39,000 per year',
    },
  },
]

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug)
}
