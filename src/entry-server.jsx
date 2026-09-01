// Server entry used only at build time by scripts/prerender.mjs.
//
// Why prerender a site this small: Googlebot executes JavaScript, but most of
// the crawlers that feed AI answer engines do not. An empty <div id="root">
// means ChatGPT, Perplexity and friends see a blank page and can never cite
// WOTA. Rendering the same React tree to a static string at build time puts the
// real copy — services, case studies, FAQ answers — into the HTML source.
//
// The browser still boots with createRoot (not hydrateRoot), so React discards
// this markup and mounts fresh. That keeps us clear of hydration mismatches
// from the video timing and scroll hooks; the static output is for crawlers.

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import App from './App.jsx';

export function render(url) {
  return renderToString(
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </MotionConfig>
    </LazyMotion>
  );
}
