import { useEffect } from 'react';
import { headTags } from '../lib/head';

// Tags this component owns, carried across renders so a tag that one route
// sets and the next one doesn't (the 404 has no canonical and no keywords) is
// removed rather than left pointing at the previous page.
let managed = new Set();

// Keeps <head> correct after a client-side route change.
//
// The static HTML shipped by scripts/prerender.mjs already carries the right
// tags for a cold load — this is what keeps them right when React Router swaps
// pages without a reload, so a share on WhatsApp or a JS-rendering crawler sees
// the current page rather than whichever one the visitor landed on first.
//
// Tags are patched in place (matched by their selector) rather than appended,
// so nothing accumulates across navigations. No react-helmet needed for three
// routes.
export default function Seo({ page }) {
  useEffect(() => {
    const { title, tags, ld } = headTags(page);
    document.title = title;

    const applied = new Set();
    for (const { key, tag, attrs } of tags) {
      let el = document.head.querySelector(key);
      if (!el) {
        el = document.createElement(tag);
        document.head.appendChild(el);
      }
      for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
      applied.add(key);
    }

    for (const key of managed) {
      if (!applied.has(key)) document.head.querySelector(key)?.remove();
    }
    managed = applied;

    // Structured data is replaced wholesale — merging graphs across routes
    // would leave stale nodes behind.
    const ID = 'ld-route';
    document.getElementById(ID)?.remove();
    if (ld) {
      const script = document.createElement('script');
      script.id = ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    }
  }, [page]);

  return null;
}
