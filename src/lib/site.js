// Single source of truth for everything SEO / GEO / AEO.
//
// Consumed in three places:
//   1. <Seo> at runtime, for client-side route changes
//   2. scripts/prerender.mjs, which bakes the same tags into the static HTML so
//      crawlers that don't run JavaScript (most AI answer engines) still see them
//   3. scripts/prerender.mjs again, for sitemap.xml / robots.txt / llms.txt
//
// Keep this file plain JS (no JSX, no React) — the Node build scripts import it
// directly.

import { faqs } from '../data/faqs.js';

// Canonical origin. Every absolute URL in the metadata is built off this, so
// moving domain is a one-line change here (plus the .htaccess redirect and a
// fresh sitemap submission in Search Console).
export const SITE_URL = 'https://home.wota.africa';

export const SITE = {
  url: SITE_URL,
  name: 'WOTA Solutions',
  legalName: 'WOTA Solutions',
  shortName: 'WOTA',
  tagline: 'Every Sip. Every Scan. Every Impact.',
  email: 'info@wota.africa',
  locale: 'en_ZA',
  lang: 'en-ZA',
  country: 'ZA',
  region: 'South Africa',
  founded: '2024',
  themeColor: '#1D1D1B',
  // 1280x720 — the hero poster frame, the most on-brand landscape image we ship.
  ogImage: '/assets/wota-bg-poster.jpg',
  ogImageWidth: 1280,
  ogImageHeight: 720,
  ogImageAlt: 'A WOTA branded water bottle rising through water',
  logo: '/assets/wota-mark.png',
  // Public profiles. Footer/Contact link to these, and they go out as the
  // Organization's `sameAs` — how search and AI engines confirm the brand is
  // one real entity rather than a name that happens to match. Canonical form
  // only: no ?igsh=/?utm_ tracking params, which would look like a third URL.
  instagram: 'https://www.instagram.com/wota_tech',
  linkedin: '', // not set up yet — add here and it links itself everywhere
  hours: {
    opens: '08:00',
    closes: '17:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
};

SITE.social = [SITE.instagram, SITE.linkedin].filter(Boolean);

export const abs = (path) => (/^https?:/.test(path) ? path : SITE_URL + path);

// --- per-route metadata ---------------------------------------------------
// `path` doubles as the React Router path and the sitemap URL.
export const PAGES = {
  home: {
    path: '/',
    title: 'WOTA Solutions | Branded Bottles, Smart QR, Real Engagement',
    description:
      'WOTA turns branded water bottles into a measurable marketing channel: your brand on the front, sponsors and a trackable QR code on the back, every scan reported on your campaign dashboard.',
    keywords: [
      'branded water bottles',
      'QR code marketing',
      'event branding South Africa',
      'sponsor visibility',
      'brand activation',
      'physical to digital marketing',
      'engagement analytics',
      'corporate event marketing',
    ],
    type: 'website',
    priority: '1.0',
    changefreq: 'weekly',
  },
  contact: {
    path: '/contact',
    title: 'Contact WOTA Solutions | Start Your Bottle Campaign',
    description:
      'Tell us about your event, activation or sponsorship and we come back with a plan — bottle design, QR destination and engagement dashboard included. We reply within one business day.',
    keywords: ['contact WOTA', 'branded bottle quote', 'event bottle branding enquiry'],
    type: 'website',
    priority: '0.8',
    changefreq: 'monthly',
  },
  notFound: {
    path: null, // never enters the sitemap
    title: 'Page not found | WOTA Solutions',
    description:
      'That page does not exist. Head back to the WOTA homepage to see how branded bottles carry your message.',
    noindex: true,
    type: 'website',
  },
};

// What WOTA sells, in the shape schema.org wants for an OfferCatalog. Mirrors
// src/data/services.jsx (which carries JSX icons and so can't be imported here).
export const SERVICE_CATALOG = [
  [
    'Branded Bottle Campaigns',
    'Custom-labelled water bottles carrying your identity, campaign message and call to action — designed, printed and delivered.',
  ],
  [
    'Smart QR Engagement',
    'Every bottle carries a trackable QR code linking to your programme, agenda, menu, offer or landing page. One scan, one measurable lead.',
  ],
  [
    'Engagement Analytics',
    'A campaign dashboard showing total scans, unique reach, scan-through rates and peak engagement times.',
  ],
  [
    'Sponsor Visibility Packages',
    'Back-label real estate for event sponsors and partners, printed alongside the barcode for guaranteed hand-held visibility.',
  ],
  [
    'Lead Capture & Database Building',
    'Scans feed a sign-up form or competition entry, building an opted-in customer database ready for retargeting.',
  ],
  [
    'Newsletter & Ongoing Engagement',
    'Guests who scan can subscribe to your newsletter, so you keep in touch long after the event ends.',
  ],
  [
    'End-To-End Campaign Management',
    'From label design and QR setup to delivery logistics and the post-event performance report.',
  ],
];

// --- structured data ------------------------------------------------------
// One @graph per page. Shared nodes are referenced by @id rather than repeated,
// which is what Google and the LLM crawlers prefer.

const orgId = `${SITE_URL}/#organization`;
const siteId = `${SITE_URL}/#website`;

const organization = {
  '@type': 'Organization',
  '@id': orgId,
  name: SITE.name,
  legalName: SITE.legalName,
  alternateName: SITE.shortName,
  url: SITE_URL,
  email: SITE.email,
  slogan: SITE.tagline,
  foundingDate: SITE.founded,
  description:
    'WOTA Solutions is a South African marketing company that uses branded water bottles as a message-delivery vehicle. Client branding goes on the front label, sponsor logos and a trackable QR code on the back, and every scan is reported on a campaign dashboard.',
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: abs(SITE.logo),
    width: 343,
    height: 343,
    caption: SITE.name,
  },
  image: { '@id': `${SITE_URL}/#logo` },
  address: {
    '@type': 'PostalAddress',
    addressCountry: SITE.country,
    addressRegion: SITE.region,
  },
  areaServed: [
    { '@type': 'Country', name: 'South Africa' },
    { '@type': 'Continent', name: 'Africa' },
  ],
  knowsAbout: [
    'Branded water bottle marketing',
    'QR code campaign tracking',
    'Event sponsorship visibility',
    'Brand activations',
    'Lead capture and database building',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      areaServed: SITE.country,
      availableLanguage: ['en'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SITE.hours.days,
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    },
  ],
  ...(SITE.social.length ? { sameAs: SITE.social } : {}),
};

const website = {
  '@type': 'WebSite',
  '@id': siteId,
  url: SITE_URL,
  name: SITE.name,
  description: PAGES.home.description,
  publisher: { '@id': orgId },
  inLanguage: SITE.lang,
};

const webPage = (page, extra = {}) => ({
  '@type': 'WebPage',
  '@id': `${abs(page.path)}#webpage`,
  url: abs(page.path),
  name: page.title,
  description: page.description,
  isPartOf: { '@id': siteId },
  about: { '@id': orgId },
  primaryImageOfPage: { '@type': 'ImageObject', url: abs(SITE.ogImage) },
  inLanguage: SITE.lang,
  ...extra,
});

const breadcrumb = (trail) => ({
  '@type': 'BreadcrumbList',
  '@id': `${abs(trail[trail.length - 1][1])}#breadcrumb`,
  itemListElement: trail.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: abs(path),
  })),
});

// FAQPage is the single highest-leverage block for answer engines: it hands
// ChatGPT / Perplexity / Google a pre-written question-and-answer pair to quote.
const faqPage = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const service = {
  '@type': 'Service',
  '@id': `${SITE_URL}/#service`,
  name: 'Branded bottle marketing campaigns',
  serviceType: 'Physical-to-digital marketing',
  provider: { '@id': orgId },
  areaServed: { '@type': 'Country', name: 'South Africa' },
  audience: {
    '@type': 'BusinessAudience',
    name: 'Event organisers, brands and sponsors',
  },
  description:
    'End-to-end branded water bottle campaigns: label design, sponsor placement, a trackable QR destination and a dashboard reporting scans, reach and lead capture.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'WOTA services',
    itemListElement: SERVICE_CATALOG.map(([name, description], i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: { '@type': 'Service', name, description, provider: { '@id': orgId } },
    })),
  },
};

export function jsonLd(pageKey) {
  const page = PAGES[pageKey];
  if (pageKey === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        website,
        webPage(page, { breadcrumb: { '@id': `${SITE_URL}/#breadcrumb` } }),
        breadcrumb([['Home', '/']]),
        service,
        faqPage,
      ],
    };
  }
  if (pageKey === 'contact') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        website,
        webPage(page, { '@type': 'ContactPage' }),
        breadcrumb([
          ['Home', '/'],
          ['Contact', '/contact'],
        ]),
      ],
    };
  }
  return null;
}
