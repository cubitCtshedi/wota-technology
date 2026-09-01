import { Reveal } from '../lib/motion';
import ContactForm from '../components/ContactForm';
import Seo from '../components/Seo';
import { SITE } from '../lib/site';

const CONTACT_EMAIL = 'info@wota.africa';

export default function Contact() {
  return (
    <main className="contact-page">
      {/* title, description, canonical and ContactPage structured data */}
      <Seo page="contact" />
      <div className="wrap">
        <Reveal className="contact-head">
          <span className="eyebrow">Get in touch</span>
          <h1>
            Let’s put your brand
            <br />
            on every bottle.
          </h1>
          <p>
            Tell us about your event, activation or sponsorship and we’ll come back with a plan —
            bottle design, QR destination and the engagement dashboard included.
          </p>
        </Reveal>

        <div className="contact-grid">
          <Reveal className="contact-aside" as="aside">
            <h2>Talk to a human</h2>
            <p className="contact-aside-lead">
              Prefer to reach out directly? We usually reply within one business day.
            </p>

            <ul className="contact-list">
              <li>
                <span className="ci-label">Email</span>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <span className="ci-label">Based in</span>
                <span>South Africa · working continent-wide</span>
              </li>
              <li>
                <span className="ci-label">Hours</span>
                <span>Mon–Fri, 08:00–17:00 SAST</span>
              </li>
            </ul>

            <div className="contact-social">
              <a
                href={SITE.instagram}
                aria-label="WOTA on Instagram"
                target="_blank"
                rel="noopener noreferrer me"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {SITE.linkedin && (
                <a
                  href={SITE.linkedin}
                  aria-label="WOTA on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.8-1.95 3.7-1.95 3.96 0 4.7 2.4 4.7 5.5V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" />
                  </svg>
                </a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
