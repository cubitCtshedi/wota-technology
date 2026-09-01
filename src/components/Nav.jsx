import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStickyNav } from '../hooks/useStickyNav';
import { useScrollSpy } from '../hooks/useScrollSpy';

// One source for both the desktop row and the mobile dropdown, so they can't
// drift apart. `id` is the homepage section each link points at.
const LINKS = [
  { label: 'About WOTA', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Projects', id: 'projects' },
  { label: 'Gallery', id: 'gallery' },
];

const SECTION_IDS = LINKS.map((l) => l.id);
// Module-level so the reference is stable — see useScrollSpy.
const NO_SECTIONS = [];

export default function Nav() {
  const scrolled = useStickyNav();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const innerRef = useRef(null);

  // The sections only exist on the homepage; elsewhere there is nothing to spy
  // on and the Contact link is what's current instead.
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const activeSection = useScrollSpy(onHome ? SECTION_IDS : NO_SECTIONS);
  const onContact = pathname === '/contact';

  // While the mobile menu is open, close it when the user clicks/taps outside
  // the nav pill or presses Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (innerRef.current && !innerRef.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className={scrolled ? 'scrolled' : undefined}>
      <div className="wrap nav-inner" ref={innerRef}>
        <Link className="logo" to="/" aria-label="WOTA" onClick={close}>
          <img className="flame" src="/assets/wota-mark.png" alt="WOTA" />
        </Link>
        <div className="nav-links">
          {LINKS.map(({ label, id }) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={activeSection === id ? 'active' : undefined}
              // aria-current tells a screen reader which section is being read,
              // the same thing the colour change says visually.
              aria-current={activeSection === id ? 'true' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <Link
            to="/contact"
            className="btn btn-line"
            onClick={close}
            aria-current={onContact ? 'page' : undefined}
          >
            Get Started
            <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`nav-mobile${open ? ' open' : ''}`}>
          {LINKS.map(({ label, id }) => (
            <Link
              key={id}
              to={`/#${id}`}
              onClick={close}
              className={activeSection === id ? 'active' : undefined}
              aria-current={activeSection === id ? 'true' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={close}
            className={onContact ? 'active' : undefined}
            aria-current={onContact ? 'page' : undefined}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
