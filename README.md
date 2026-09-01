# WOTA Solutions — Marketing Website

Marketing website for **WOTA Solutions**, built as a **Vite + React** single-page app. Fonts load from Google Fonts (**Plus Jakarta Sans** for display headings, **Inter** for body; falls back to system fonts offline).

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
wota/
├── index.html                 # Vite entry: <head> shell with <!--seo--> markers + #root
├── vite.config.js             # Vite + React, plus clean-URL preview middleware
├── package.json
├── scripts/
│   ├── prerender.mjs          # static HTML per route + sitemap/robots/llms.txt
│   └── deploy.mjs             # FTP upload of dist/ to Afrihost
├── public/
│   ├── .htaccess              # HTTPS, canonical URLs, caching, 404, gzip
│   ├── contact.php            # contact-form endpoint
│   └── assets/                # images + hero video (served at /assets/…)
└── src/
    ├── main.jsx               # React root (browser), imports index.css
    ├── entry-server.jsx       # React root (build-time prerender only)
    ├── App.jsx                # routes: /, /contact, 404
    ├── index.css              # all global styles
    ├── lib/
    │   ├── site.js            #   SEO source of truth: URLs, copy, JSON-LD
    │   ├── head.js            #   builds a route's head tags as data
    │   └── motion.jsx         #   shared scroll-reveal wrapper
    ├── pages/                 # Home.jsx, Contact.jsx, NotFound.jsx
    ├── components/            # one file per section
    │   ├── Seo.jsx            #   reapplies head tags on client-side nav
    │   ├── Nav.jsx            #   sticky navigation
    │   ├── Hero.jsx           #   full-viewport hero (video + WOTA wordmark)
    │   ├── Features.jsx       #   "Smart. Simple. Powerful." dark panel
    │   ├── Steps.jsx          #   4-step bottle-to-dashboard list
    │   ├── Services.jsx       #   7 service cards
    │   ├── Projects.jsx       #   tabbed case studies
    │   ├── FaqDashboard.jsx   #   FAQ accordion + dashboard mock
    │   ├── Cta.jsx            #   "Start Your Campaign Now"
    │   └── Footer.jsx
    ├── hooks/                 # reusable behaviour
    │   ├── useStickyNav.js    #   transparent → solid nav on scroll
    │   └── useHeroWord.js     #   reveal the wordmark when the bottle lands
    └── data/                  # section content as data
        ├── services.jsx
        ├── projects.jsx
        ├── gallery.js
        ├── steps.js
        └── faqs.js
```

> The look, markup, and CSS are unchanged from the original single-file site — this is purely a structural refactor into React components. The design notes below describe an earlier iteration of the visual design and may not match the current markup.

## Business context

WOTA Solutions is a South African marketing company that turns **QR-coded branded water bottles into physical-to-digital marketing touchpoints**. The core pitch: traditional branded merch generates an impression and nothing else — WOTA makes every bottle a trackable, attributable event.

**Funnel:** brand the bottle → distribute at events/retail/activations → customer scans QR → lands on branded page → details captured into a customer database → follow-up via email campaigns and digital retargeting.

**Campaign tiers:** Start, Growth, Impact, Enterprise — from a single activation to a national rollout with custom integrations. No public pricing; the site uses "Get Started" / "Talk to Us" CTAs instead of numbers.

## Brand identity

Derived from the product photo (`assets/bottle-hero.jpeg`): black bottle, black label, moody black background with water splashes, dramatic studio lighting. The label is a thin silver-bordered rectangle reading **W / flame-droplet icon / T / Δ** stacked vertically ("WOTA" with the O replaced by the icon), with "● STILL WATER" in letter-spaced caps.

### Palette (CSS variables in `:root` at the top of the `<style>` block)

| Variable | Value | Use |
|---|---|---|
| `--navy` | `#101113` | page background |
| `--navy-deep` | `#030304` | hero / CTA background |
| `--panel` / `--panel-2` | `#17181b` / `#1d1f23` | cards |
| `--line` | `#2a2c31` | borders |
| `--silver` | `#e9eaec` | text |
| `--muted` | `#9a9ea6` | secondary text |
| `--cyan` → `--mint` | `#2ec5c6` → `#33e6a0` | accent gradient (`--grad`): icon, buttons, highlights |

Change the palette there if the photo ever suggests different shades.

## Page structure (in order)

`header` (sticky nav) → `.hero` (full-viewport editorial hero: giant "WOTA" wordmark behind the bottle photo) → `.marquee` (scrolling outline-text ticker) → `#problem` (two-column ×/✓ comparison) → `#how` (4-step funnel, ghost-number rows) → `#analytics` (dashboard mockup with animated counters/bars) → `#packages` (4 tier columns) → `#why` (3 USP rows) → `#contact` (CTA) → `footer`.

## Implementation notes

- **Hero design** is modeled on two editorial references (a "Norway Mountains" split-panel travel page and an "ALIVE" juice-bottle product hero): a giant gradient `WOTA` wordmark (`.hero-word`, ~23vw Archivo 900) sits *behind* the real bottle photo. The photo's black studio background is blended into the hero with a radial `mask-image` on `.hero-bottle`, so the letters appear to emerge from behind the bottle. Overlaid on top: a frosted-glass info panel (`.hero-info`, `backdrop-filter: blur`) with kicker + feature list + tagline, a "1 scan = 1 attributable lead" stat with CTAs (`.hero-buy`), a `01–04` section pagination nav (`.hero-steps`), and a vertical social-icon rail (`.hero-social`, placeholder `#` links — point at real profiles when they exist).
- **Two-typeface system**: **Archivo** (400–900) for body, UI, kickers, buttons, and the giant wordmark; **Fraunces** (serif, `--serif`) for all `h2` section headings and tier names, with italic gradient accent words via `h2 em`. Buttons and nav links are squared (3px radius), uppercase, letter-spaced.
- **No card boxes**: sections use editorial hairline rules instead — the problem/solution comparison is two columns split by a vertical rule (`.col-merch` / `.col-wota`), steps and USPs are top-ruled rows with outlined ghost numbers (`.idx`), KPIs are separated by vertical rules, and package tiers are rule-divided columns whose CTA is an underlined arrow link (`.tier-link`), not a button. Hovering a step/USP/tier animates a gradient rule across its top edge.
- **Motion** (all disabled under `prefers-reduced-motion`):
  - Hero entrance: wordmark letters rise in staggered, bottle scales/fades in then floats on a slow idle loop, frosted panel slides in from the left, CTAs/pagination/social fade up in sequence.
  - `.marquee` — infinite scrolling ticker ("Brand it ✦ Distribute it ✦ Scan it ✦ Measure it") in stroked outline type between the hero and the first section.
  - Scroll reveals: elements tagged `.reveal` fade/slide up via a single `IntersectionObserver` (inline script at the bottom of `index.html`), auto-staggered 90ms between siblings.
  - Dashboard: KPI numbers count up (`.count` with `data-target`/`data-suffix`) and bars grow to `--h` when the dash scrolls into view.
- **Gotcha**: `background-clip: text` must sit on the individual `.hero-word i` letters, not the parent — Chromium fails to paint the clipped gradient under transformed/animated children.
- The Open Graph share image is now an absolute URL built from `SITE_URL` in `src/lib/site.js` — see the SEO section below.
- Responsive breakpoints at **980px** (hero stacks: bottle art on top, info/CTAs/steps flow below; social rail hides; grids go 2-up; nav links hide) and **600px** (everything single-column, tighter spacing).
- The nav/footer logo is an inline SVG droplet in the brand gradient; the favicon is the same shape as a data URI.
- CTA mailto points at `hello@wota.co.za` — placeholder, update when the real address exists.

## SEO, GEO & AEO

Everything that search engines and AI answer engines read is derived from **one
file**: [`src/lib/site.js`](src/lib/site.js). Change the canonical domain, a page
title, a description or the service list there and the meta tags, the structured
data, `sitemap.xml` and `llms.txt` all follow. Nothing is hand-maintained twice.

### The build now has three stages

```
npm run build
  ├─ build:client   vite build                     -> dist/ (the SPA)
  ├─ build:server   vite build --ssr               -> dist-ssr/entry-server.js
  └─ prerender      node scripts/prerender.mjs     -> static HTML + crawl files
```

The prerender stage is the important one. Googlebot runs JavaScript, but most of
the crawlers behind ChatGPT, Claude, Perplexity and Copilot do **not** — an empty
`<div id="root">` reads to them as a blank page, and a blank page is never cited.
So every route is rendered to a static HTML file with the real copy in the source:

| File | Route |
| --- | --- |
| `dist/index.html` | `/` |
| `dist/contact/index.html` | `/contact` |
| `dist/404.html` | `ErrorDocument 404`, and any unmatched path via the SPA |

The browser still boots with `createRoot` (not `hydrateRoot`), so React discards
that markup and mounts fresh — no hydration mismatches from the video timing or
the scroll hooks. The static output exists for crawlers. The hero `<video>` is
stripped from it so the 1.2 MB clip isn't fetched twice.

### What each page carries

- Title, description, keywords, canonical, `robots`, and `geo.region`/`geo.placename` for South Africa
- Open Graph + Twitter card, with an absolute 1280x720 image
- JSON-LD (`@graph`): `Organization`, `WebSite`, `WebPage`/`ContactPage`,
  `BreadcrumbList`, `Service` with a 7-item `OfferCatalog`, and `FAQPage`

`FAQPage` is the highest-leverage block for answer engines — it hands them a
pre-written question-and-answer pair to quote, generated straight from
`src/data/faqs.js`.

`src/components/Seo.jsx` reapplies the same tags after a client-side navigation,
so a link shared from `/contact` doesn't preview as the homepage. It patches tags
in place and drops any it set on the previous route.

### Generated crawl files

- **`sitemap.xml`** — indexable routes only, with `lastmod` set at build time and image entries.
- **`robots.txt`** — allows everything, plus 20 AI crawlers named individually (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, …), because most of them ignore the `User-agent: *` group. Points at the sitemap.
- **`llms.txt`** — the [llmstxt.org](https://llmstxt.org) convention: one markdown file an LLM can read end-to-end instead of scraping. Leads with the fact WOTA gets asked about most — that it does *not* sell water — then the 4 campaign steps, the services, the event types and the full FAQ.

### Apache side (`public/.htaccess`)

Forces HTTPS, collapses `/index.html`, `/contact/index.html` and `/contact/` to
one canonical spelling with 301s, serves `/contact` from the prerendered file
without a trailing-slash redirect (`DirectorySlash Off`), sets `ErrorDocument
404`, gzips text responses, and caches fingerprinted JS/CSS forever while keeping
HTML and the crawl files revalidating — a year-cached `sitemap.xml` would pin
search engines to a dead build.

### Still to do (needs information we don't have)

- **LinkedIn**: `SITE.linkedin` in `src/lib/site.js` is empty. Set it and the icon
  appears in the footer and on the contact page, and the URL joins the
  `Organization`'s `sameAs` — nothing else to edit. (Instagram is wired up:
  `@wota_tech`.) `sameAs` is how search and AI engines confirm the brand is one
  real entity rather than a name that happens to match.
- If a street address ever exists, upgrade the `Organization` node to
  `LocalBusiness` with a `PostalAddress` and geo coordinates.
- Submit `https://home.wota.africa/sitemap.xml` in Google Search Console and Bing
  Webmaster Tools once the domain is verified.
- The footer's Terms / Privacy / Cookie links point at `#`. Real policy pages are
  a trust signal engines look for on a commercial site.

## Not part of this site

The founder (Cubit) is also building a separate South African financial-statement analysis tool (inspired by Vault22/22seven, FNB as primary banking reference). Distinct product — don't fold it into this website.
