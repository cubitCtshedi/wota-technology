import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStickyNav } from '../hooks/useStickyNav';

export default function Nav() {
  const scrolled = useStickyNav();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className={scrolled ? 'scrolled' : undefined}>
      <div className="wrap nav-inner">
        <Link className="logo" to="/" aria-label="WOTA" onClick={close}>
          <img className="flame" src="/assets/wota-mark.png" alt="WOTA" />
        </Link>
        <div className="nav-links">
          <Link to="/#about">About WOTA</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#projects">Projects</Link>
          <Link to="/#gallery">Gallery</Link>
        </div>
        <div className="nav-right">
          <Link to="/contact" className="btn btn-line" onClick={close}>
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
          <Link to="/#about" onClick={close}>
            About WOTA
          </Link>
          <Link to="/#services" onClick={close}>
            Services
          </Link>
          <Link to="/#projects" onClick={close}>
            Projects
          </Link>
          <Link to="/#gallery" onClick={close}>
            Gallery
          </Link>
          <Link to="/contact" onClick={close}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
