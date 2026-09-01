// Builds the full head for a route as plain data, so the exact same tags can be
// applied two ways: serialised into static HTML at build time (prerender.mjs)
// and patched onto document.head at runtime (<Seo>) after a client-side nav.

import { SITE, PAGES, abs, jsonLd } from './site.js';

// A tag is described by the attribute that identifies it ("key") plus the rest.
// The key is what <Seo> uses to find and update an existing tag instead of
// piling up duplicates on every route change.
export function headTags(pageKey) {
  const page = PAGES[pageKey];
  if (!page) throw new Error(`Unknown page key: ${pageKey}`);

  const canonical = page.path ? abs(page.path) : null;
  const image = abs(SITE.ogImage);

  const meta = [
    ['description', page.description],
    page.keywords && ['keywords', page.keywords.join(', ')],
    ['author', SITE.name],
    [
      'robots',
      page.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ],
    // Geographic targeting — WOTA sells into South Africa specifically.
    ['geo.region', 'ZA'],
    ['geo.placename', SITE.region],
  ].filter(Boolean);

  const og = [
    ['og:type', page.type || 'website'],
    ['og:site_name', SITE.name],
    ['og:title', page.title],
    ['og:description', page.description],
    canonical && ['og:url', canonical],
    ['og:image', image],
    ['og:image:width', String(SITE.ogImageWidth)],
    ['og:image:height', String(SITE.ogImageHeight)],
    ['og:image:alt', SITE.ogImageAlt],
    ['og:locale', SITE.locale],
  ].filter(Boolean);

  const twitter = [
    ['twitter:card', 'summary_large_image'],
    ['twitter:title', page.title],
    ['twitter:description', page.description],
    ['twitter:image', image],
    ['twitter:image:alt', SITE.ogImageAlt],
  ];

  const tags = [
    ...meta.map(([name, content]) => ({ key: `meta[name="${name}"]`, tag: 'meta', attrs: { name, content } })),
    // Open Graph uses property=, not name= — Facebook/LinkedIn/WhatsApp only
    // read the property form.
    ...og.map(([property, content]) => ({
      key: `meta[property="${property}"]`,
      tag: 'meta',
      attrs: { property, content },
    })),
    ...twitter.map(([name, content]) => ({ key: `meta[name="${name}"]`, tag: 'meta', attrs: { name, content } })),
  ];

  if (canonical) {
    tags.push({ key: 'link[rel="canonical"]', tag: 'link', attrs: { rel: 'canonical', href: canonical } });
  }

  return { title: page.title, tags, ld: jsonLd(pageKey) };
}
