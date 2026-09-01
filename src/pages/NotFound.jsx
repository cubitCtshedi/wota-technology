import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { Reveal } from '../lib/motion';

// The Apache rewrite hands every unmatched path to the SPA, so without this
// route a typo'd URL would render the homepage under a 200 — a soft 404 that
// search engines happily index as duplicate content. This page carries
// `noindex, follow` (see PAGES.notFound) so those URLs stay out of the index
// while the links on them still pass crawlers back to the real pages.
export default function NotFound() {
  return (
    <main className="contact-page">
      <Seo page="notFound" />
      <div className="wrap">
        <Reveal className="contact-head">
          <span className="eyebrow">404</span>
          <h1>
            This page went
            <br />
            down the drain.
          </h1>
          <p>
            The link you followed doesn&rsquo;t exist. Head back to the homepage to see how WOTA turns
            branded bottles into a measurable marketing channel — or get in touch and we&rsquo;ll point
            you the right way.
          </p>
          <p style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link className="btn btn-line" to="/">
              Back to home
            </Link>
            <Link className="btn btn-line" to="/contact">
              Contact us
            </Link>
          </p>
        </Reveal>
      </div>
    </main>
  );
}
