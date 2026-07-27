import { Link } from 'react-router-dom';
import { Reveal } from '../lib/motion';

// Footer link columns — [label, href]
const columns = [
  {
    title: 'Products',
    links: [
      ['Branded Bottles', '/#services'],
      ['QR Technology', '/#services'],
      ['Campaigns', '/#projects'],
      ['Analytics', '/#faq'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About WOTA', '/#about'],
      ['Our Mission', '/#about'],
      ['Case Studies', '/#projects'],
      ['Contact Us', '/contact'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Terms & Conditions', '#'],
      ['Privacy Policy', '#'],
      ['Cookie Policy', '#'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* underwater bottle image bleeding in from the right */}
      <div className="footer-media" aria-hidden="true">
        <img src="/assets/footer-underwater.png" alt="" loading="lazy" />
      </div>

      <div className="wrap footer-inner">
        <Reveal className="footer-brand">
          <Link className="footer-logo" to="/" aria-label="WOTA">
            <img src="/assets/wota-logo-white.png" alt="WOTA" />
          </Link>
          <p className="footer-tagline">Every Sip. Every Scan. Every Impact.</p>
          <p className="footer-lead">
            We don't sell water — we turn every bottle into a marketing channel. Smart QR technology
            that connects brands to real people in real time.
          </p>
        </Reveal>

        <Reveal className="footer-cols" delay={0.1}>
          {columns.map((col) => (
            <div className="fcol" key={col.title}>
              <h4>
                {col.title}
                <span>.</span>
              </h4>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <div className="footer-base">
          <span className="footer-copy">© 2026 WOTA. All rights reserved.</span>
          <span className="footer-slogan">
            <b>WOTA</b> — Where Hydration Meets Innovation.
          </span>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.8-1.95 3.7-1.95 3.96 0 4.7 2.4 4.7 5.5V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" />
              </svg>
            </a>
            <a href="mailto:info@wota.africa" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 7 8.5 6 8.5-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
