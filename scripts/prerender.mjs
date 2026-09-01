// Post-build step. Runs after `vite build` (client) and `vite build --ssr`.
//
// Takes the empty dist/index.html shell and, for every route, writes a real
// HTML file containing:
//   • the route's own title / description / canonical / OG / Twitter tags
//   • its JSON-LD structured data
//   • the fully rendered React markup, so the copy is in the source
//
// Then emits the crawl-control files: sitemap.xml, robots.txt and llms.txt.
// All of it is derived from src/lib/site.js, so the metadata, the sitemap and
// the LLM summary can never drift apart.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { SITE, SITE_URL, PAGES, SERVICE_CATALOG, abs } from '../src/lib/site.js';
import { headTags } from '../src/lib/head.js';
import { faqs } from '../src/data/faqs.js';
import { steps } from '../src/data/steps.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const { render } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href);

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const buildDate = new Date().toISOString().slice(0, 10);

// --- html helpers ---------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headHtml(pageKey) {
  const { title, tags, ld } = headTags(pageKey);
  const lines = [`<title>${esc(title)}</title>`];

  for (const { tag, attrs } of tags) {
    const attrString = Object.entries(attrs)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(' ');
    lines.push(`<${tag} ${attrString}>`);
  }

  if (ld) {
    // Escaping "<" keeps a stray "</script>" inside any copy from ending the
    // block early; JSON parsers read the < escape fine.
    const json = JSON.stringify(ld, null, 2).replace(/</g, '\\u003c');
    // Same id <Seo> uses at runtime, so a client-side nav replaces this block
    // instead of appending a second, stale graph beside it.
    lines.push(`<script type="application/ld+json" id="ld-route">\n${json}\n</script>`);
  }

  return lines.join('\n');
}

// The prerendered markup is for crawlers — the browser boots with createRoot
// and throws it away. Dropping the hero <video> stops the browser fetching the
// 1.2 MB clip once for the static markup and again for the React tree.
const stripVideo = (html) => html.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g, '');

function writePage(pageKey, url, outPath) {
  const markup = stripVideo(render(url));
  const html = template
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, headHtml(pageKey))
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

  const file = join(dist, outPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  console.log(`  ✓ ${outPath.padEnd(20)} ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
}

// --- pages ----------------------------------------------------------------
console.log('→ Prerendering routes');
writePage('home', '/', 'index.html');
writePage('contact', '/contact', 'contact/index.html');
// Served by `ErrorDocument 404` for paths Apache can't resolve.
writePage('notFound', '/404', '404.html');

// --- sitemap.xml ----------------------------------------------------------
const indexable = Object.values(PAGES).filter((p) => p.path && !p.noindex);
const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...indexable.map((p) =>
    [
      '  <url>',
      `    <loc>${abs(p.path)}</loc>`,
      `    <lastmod>${buildDate}</lastmod>`,
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      '    <image:image>',
      `      <image:loc>${abs(SITE.ogImage)}</image:loc>`,
      `      <image:title>${esc(SITE.name)}</image:title>`,
      `      <image:caption>${esc(SITE.ogImageAlt)}</image:caption>`,
      '    </image:image>',
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(dist, 'sitemap.xml'), sitemapXml, 'utf8');

// --- robots.txt -----------------------------------------------------------
// Named individually rather than relying on the wildcard: several of these
// crawlers ignore `User-agent: *` for training/answer use and look only for
// their own token, so an explicit Allow is what actually opts WOTA in to being
// cited by ChatGPT, Claude, Perplexity, Gemini and Copilot.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'DuckAssistBot',
  'Meta-ExternalAgent',
  'MistralAI-User',
  'YouBot',
];

const robots = [
  `# ${SITE.name} — ${SITE_URL}`,
  '# Search engines and AI answer engines are both welcome here.',
  '',
  'User-agent: *',
  'Allow: /',
  // The PHP form endpoint only ever answers POST — nothing to index.
  'Disallow: /contact.php',
  '',
  '# AI crawlers, named explicitly — most ignore the wildcard group above.',
  ...AI_AGENTS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', 'Disallow: /contact.php', '']),
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n');
writeFileSync(join(dist, 'robots.txt'), robots, 'utf8');

// --- llms.txt -------------------------------------------------------------
// The emerging convention (llmstxt.org): a single markdown file an LLM can read
// end-to-end instead of scraping. Written as plain prose facts, because that is
// what gets quoted back in an answer.
// Profile links belong in here too: an answer engine that cites WOTA can point
// a reader at the real account rather than only the site.
const socialLines = SITE.social
  .map((u) => `- [${u.includes('instagram') ? 'Instagram' : 'LinkedIn'}](${u}): campaign photos and event work.`)
  .join('\n');

const llms = `# ${SITE.name}

> ${SITE.name} is a South African marketing company that uses branded water bottles as a message-delivery vehicle. The client's brand goes on the front label, sponsor logos and a trackable QR code go on the back, and every scan is reported on a campaign dashboard. Tagline: "${SITE.tagline}"

## What WOTA is, and is not

- WOTA **does not sell water**. The bottle is the medium; the product is message delivery, sponsor visibility and measurable engagement.
- WOTA is a physical-to-digital marketing channel: a physical object placed in a guest's hand, connected to a digital destination that reports back.
- Based in ${SITE.region}, working continent-wide across Africa.
- Contact: ${SITE.email} — replies within one business day, ${SITE.hours.opens}–${SITE.hours.closes} SAST, Monday to Friday.

## How a WOTA campaign works

${steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.body}`).join('\n')}

## Services

${SERVICE_CATALOG.map(([name, body]) => `- **${name}** — ${body}`).join('\n')}

## Events WOTA works with

Corporate events and summits, golf days, charity fundraisers, brand activations, and private functions — any occasion where a message needs to reach every hand in the room.

## Frequently asked questions

${faqs.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}

## Pages

- [Home](${abs('/')}): what WOTA does, how a campaign works, services, case studies, gallery and FAQ.
- [Contact](${abs('/contact')}): enquiry form for events, activations and sponsorships.
${socialLines}

---
Last updated: ${buildDate}
`;
writeFileSync(join(dist, 'llms.txt'), llms, 'utf8');

console.log('→ Crawl files');
console.log(`  ✓ sitemap.xml        ${indexable.length} URLs`);
console.log(`  ✓ robots.txt         ${AI_AGENTS.length} AI crawlers allowed`);
console.log(`  ✓ llms.txt           ${(Buffer.byteLength(llms) / 1024).toFixed(1)} KB`);
