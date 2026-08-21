export type Region = 'uk' | 'us' | 'ca' | 'au' | 'nz'

export const regions: Record<
  Region,
  { label: string; symbol: string; name: string; flag: string; currency: string }
> = {
  uk: { label: 'United Kingdom', symbol: '£', name: 'UK', flag: '🇬🇧', currency: 'GBP' },
  us: { label: 'United States', symbol: '$', name: 'US', flag: '🇺🇸', currency: 'USD' },
  ca: { label: 'Canada', symbol: 'C$', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  au: { label: 'Australia', symbol: 'A$', name: 'AU', flag: '🇦🇺', currency: 'AUD' },
  nz: { label: 'New Zealand', symbol: 'NZ$', name: 'NZ', flag: '🇳🇿', currency: 'NZD' },
}

export const regionKeys = Object.keys(regions) as Region[]

export interface Role {
  id: string
  title: string
  shortTitle: string
  description: string
  responsibilities: string[]
  tools: string[]
  // Fully-loaded monthly cost of a native western hire vs Ticky monthly fee
  native: Record<Region, number>
  ticky: Record<Region, number>
  popular?: boolean
}

export const roles: Role[] = [
  {
    id: 'telesales',
    title: 'Telesales / SDR',
    shortTitle: 'Telesales',
    description:
      'Outbound calling, lead qualification and appointment setting from confident, scripted and coached English-speaking callers.',
    responsibilities: [
      'Outbound cold & warm calling campaigns',
      'Lead qualification and appointment setting',
      'CRM updates and pipeline hygiene',
      'Follow-up sequences and call logging',
    ],
    tools: ['HubSpot', 'Salesforce', 'Aircall', 'Outreach', 'Apollo'],
    native: { uk: 3200, us: 4500, ca: 5800, au: 6000, nz: 6900 },
    ticky: { uk: 1525, us: 1940, ca: 2660, au: 2915, nz: 3200 },
    popular: true,
  },
  {
    id: 'sales-exec',
    title: 'Sales Executive / Account Manager',
    shortTitle: 'Sales Executive',
    description:
      'Experienced closers and account managers who run demos, manage pipelines and nurture client relationships in your time zone.',
    responsibilities: [
      'Running discovery calls and product demos',
      'Managing and closing pipeline opportunities',
      'Account management and renewals',
      'Sales reporting and forecasting',
    ],
    tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoom', 'Gong'],
    native: { uk: 4200, us: 5800, ca: 7500, au: 7800, nz: 8900 },
    ticky: { uk: 1890, us: 2400, ca: 3285, au: 3535, nz: 3955 },
  },
  {
    id: 'admin',
    title: 'Office Administrator',
    shortTitle: 'Administration',
    description:
      'Reliable day-to-day office support: inbox, diary, data entry, document preparation and the coordination that keeps you organised.',
    responsibilities: [
      'Inbox and diary management',
      'Data entry, CRM and spreadsheet upkeep',
      'Document preparation and formatting',
      'Supplier, travel and meeting coordination',
    ],
    tools: ['Microsoft 365', 'Google Workspace', 'Slack', 'Asana', 'Notion'],
    native: { uk: 2800, us: 3900, ca: 5100, au: 5300, nz: 6000 },
    ticky: { uk: 1315, us: 1665, ca: 2285, au: 2495, nz: 2745 },
    popular: true,
  },
  {
    id: 'marketing',
    title: 'Marketing Executive',
    shortTitle: 'Marketing',
    description:
      'Hands-on marketing support across campaigns, email, SEO and analytics — trained on the platforms your business already uses.',
    responsibilities: [
      'Email campaigns and marketing automation',
      'SEO research and on-page updates',
      'Campaign reporting and analytics',
      'Landing page and CMS updates',
    ],
    tools: ['Mailchimp', 'HubSpot', 'Canva', 'WordPress', 'GA4'],
    native: { uk: 3400, us: 4700, ca: 6100, au: 6400, nz: 7200 },
    ticky: { uk: 1515, us: 1890, ca: 2590, au: 2905, nz: 3125 },
    popular: true,
  },
  {
    id: 'customer-service',
    title: 'Customer Service Representative',
    shortTitle: 'Customer Service',
    description:
      'Friendly, clear-English support across phone, email and live chat, with the patience and polish your customers expect.',
    responsibilities: [
      'Phone, email and live chat support',
      'Ticket triage and resolution',
      'Order processing and refunds',
      'Knowledge base maintenance',
    ],
    tools: ['Zendesk', 'Intercom', 'Freshdesk', 'Shopify', 'Gorgias'],
    native: { uk: 2600, us: 3600, ca: 4700, au: 4900, nz: 5500 },
    ticky: { uk: 1250, us: 1590, ca: 2180, au: 2360, nz: 2625 },
  },
  {
    id: 'bookkeeper',
    title: 'Bookkeeper / Accounts Assistant',
    shortTitle: 'Bookkeeping',
    description:
      'Detail-oriented accounts support: reconciliations, invoicing, payables and receivables handled by qualified bookkeepers.',
    responsibilities: [
      'Bank reconciliations and coding',
      'Invoicing, payables and receivables',
      'Expense processing',
      'Month-end support and reporting',
    ],
    tools: ['Xero', 'QuickBooks', 'MYOB', 'Dext', 'Excel'],
    native: { uk: 3100, us: 4300, ca: 5500, au: 5800, nz: 6600 },
    ticky: { uk: 1320, us: 1700, ca: 2325, au: 2525, nz: 2805 },
  },
  {
    id: 'ea',
    title: 'Executive Assistant',
    shortTitle: 'Executive Assistant',
    description:
      'A proactive right hand for founders and directors — inbox, calendar, travel, research and gatekeeping, done to a western standard.',
    responsibilities: [
      'Complex diary and inbox management',
      'Travel and meeting coordination',
      'Research, briefing and reporting',
      'Personal and business task support',
    ],
    tools: ['Google Workspace', 'Microsoft 365', 'Calendly', 'Slack', 'Zoom'],
    native: { uk: 3500, us: 4900, ca: 6400, au: 6600, nz: 7600 },
    ticky: { uk: 1575, us: 2020, ca: 2765, au: 3030, nz: 3335 },
  },
  {
    id: 'social',
    title: 'Social Media & Content Specialist',
    shortTitle: 'Social & Content',
    description:
      'Consistent, on-brand content creation and community management that keeps your channels active every single day.',
    responsibilities: [
      'Content calendars and scheduling',
      'Copywriting and graphic creation',
      'Community management and engagement',
      'Performance tracking and reporting',
    ],
    tools: ['Canva', 'Hootsuite', 'Buffer', 'CapCut', 'Meta Suite'],
    native: { uk: 3200, us: 4400, ca: 5800, au: 6000, nz: 6900 },
    ticky: { uk: 1445, us: 1825, ca: 2505, au: 2780, nz: 3015 },
  },
  {
    id: 'ppc',
    title: 'Google / Meta / Amazon PPC Ads Specialist',
    shortTitle: 'PPC Specialist',
    description:
      'Certified paid-media specialists who plan, build and optimise your Google, Meta and Amazon ad campaigns — squeezing more return from every pound or dollar of ad spend.',
    responsibilities: [
      'Google Ads & Microsoft Ads campaign builds and optimisation',
      'Meta (Facebook & Instagram) and Amazon PPC management',
      'Keyword, audience and competitor research',
      'Bid, budget and A/B testing management with ROI reporting',
    ],
    tools: ['Google Ads', 'Meta Ads Manager', 'Amazon Ads', 'GA4', 'Looker Studio'],
    native: { uk: 3800, us: 5300, ca: 6800, au: 7000, nz: 7900 },
    ticky: { uk: 1645, us: 2085, ca: 2855, au: 3130, nz: 3450 },
    popular: true,
  },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  initials: string
  saving: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Our Ticky SDR books more qualified meetings than the two UK hires she replaced — at less than half the cost of one. The quality of English honestly surprised me.',
    name: 'James Whitfield',
    role: 'Managing Director',
    company: 'B2B SaaS, London',
    initials: 'JW',
    saving: 'Saves £38k / year',
  },
  {
    quote:
      'We started with one part-time administrator as a test. Eighteen months later we have a team of five across sales support and marketing. It has completely changed our cost base.',
    name: 'Sarah Delaney',
    role: 'Founder & CEO',
    company: 'E-commerce brand, Austin TX',
    initials: 'SD',
    saving: 'Saves $112k / year',
  },
  {
    quote:
      'The onboarding was genuinely painless. Within two weeks our new marketing executive was running our email campaigns and social channels like she had been here for years.',
    name: 'Michael Tran',
    role: 'Director',
    company: 'Professional services, Sydney',
    initials: 'MT',
    saving: 'Saves A$74k / year',
  },
]

export interface Faq {
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    question: 'How good is their English, really?',
    answer:
      'English is an official language of the Philippines and the primary language of business and higher education. Every Ticky candidate passes a rigorous written and spoken English assessment, a neutral-accent screening and a live interview before they ever reach your shortlist. Most clients tell us they cannot tell the difference on a call.',
  },
  {
    question: 'Will they work my business hours?',
    answer:
      'Yes. Our teams work your hours — whether that is UK, US East or West Coast, Canadian, Australian or New Zealand business time. The Philippines has a long-established night-shift culture built around serving western markets, so overlapping your working day is the norm, not the exception.',
  },
  {
    question: 'What does "at least 50% saving" actually include?',
    answer:
      'Our monthly fee is fully loaded: salary, benefits, HR, equipment, management and our service margin. When you compare it to the true cost of a native hire — salary plus employer taxes, pension, benefits, office space, equipment and recruitment fees — most clients save between 55% and 70%.',
  },
  {
    question: 'Can I hire part-time as well as full-time?',
    answer:
      'Absolutely. Part-time (20 hours per week) is a popular way to start — many clients begin with a single part-time role and scale to full-time teams once they see the quality. There are no long lock-in contracts; our standard agreement rolls monthly after an initial 90-day term.',
  },
  {
    question: 'How do you handle data security and confidentiality?',
    answer:
      'All staff sign enforceable NDAs and work on company-managed, encrypted equipment in secure offices. We support role-based access, password managers, 2FA and your own VPN or VDI requirements. We are happy to work within your compliance framework, including GDPR.',
  },
  {
    question: 'What if the person is not the right fit?',
    answer:
      'You interview and choose from a handpicked shortlist before committing, which makes mismatches rare. If it still is not working, our replacement guarantee means we will find and onboard a replacement at no additional recruitment cost.',
  },
  {
    question: 'How long does it take to get someone started?',
    answer:
      'Typically two to three weeks from your discovery call to your new team member starting. We keep benches of pre-vetted, pre-trained talent across our core functions, which is why we can move much faster than a traditional recruitment process.',
  },
  {
    question: 'Who employs the staff and handles payroll?',
    answer:
      'We do. Ticky Global employs your team members directly in the Philippines and handles payroll, benefits, HR, equipment and office facilities. You receive one simple monthly invoice in your own currency.',
  },
]

export interface Step {
  number: string
  title: string
  timeframe: string
  description: string
  details: string[]
}

export const steps: Step[] = [
  {
    number: '01',
    title: 'Discovery call',
    timeframe: 'Day 1',
    description:
      'A free 30-minute call to understand your business, the role you need and what great looks like for you.',
    details: [
      'We map the role, responsibilities and KPIs together',
      'Advice on which functions offshore best',
      'Transparent pricing for part-time or full-time',
    ],
  },
  {
    number: '02',
    title: 'Handpicked shortlist',
    timeframe: 'Days 3–5',
    description:
      'We draw from our bench of pre-vetted, pre-trained Filipino professionals and test them specifically against your brief.',
    details: [
      'English, aptitude and skills testing completed',
      'Video introductions so you can hear them speak',
      'Usually 2–4 strong candidates per role',
    ],
  },
  {
    number: '03',
    title: 'Interview & select',
    timeframe: 'Week 1',
    description:
      'You interview your favourites over video and make the final call. It is your hire — we just make it easy.',
    details: [
      'Structured interviews arranged around your diary',
      'Reference and background checks included',
      'No obligation until you say yes',
    ],
  },
  {
    number: '04',
    title: 'Onboard & launch',
    timeframe: 'Week 2',
    description:
      'We handle contracts, payroll, equipment and IT. Your new team member starts in your tools, your hours, your way.',
    details: [
      'Secure, managed equipment and access set up',
      'Structured first-90-days onboarding plan',
      'Dedicated account manager from day one',
    ],
  },
]

export const stats = [
  { value: '50%+', label: 'Minimum cost saving vs a native western hire' },
  { value: '120+', label: 'Businesses supported across the UK, US, Canada, Australia & NZ' },
  { value: '400+', label: 'Filipino professionals placed and managed' },
  { value: '14 days', label: 'Average time from brief to start date' },
]
