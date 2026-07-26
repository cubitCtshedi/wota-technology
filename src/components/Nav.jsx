import { useState } from 'react';
import { useStickyNav } from '../hooks/useStickyNav';

export default function Nav() {
  const scrolled = useStickyNav();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className={scrolled ? 'scrolled' : undefined}>
      <div className="wrap nav-inner">
        <a className="logo" href="#top" aria-label="WOTA" onClick={close}>
          W
          <svg className="flame" viewBox="0 0 24 30" aria-hidden="true">
            <defs>
              <linearGradient id="wflame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#9CF0D2" />
                <stop offset=".55" stopColor="#17BBDF" />
                <stop offset="1" stopColor="#0E7FA8" />
              </linearGradient>
            </defs>
            <path
              d="M13 0c.6 5-3 7-3 11 0-2-1.1-3-2-4-.5 2-3 4-3 8a8 8 0 0 0 16 0c0-5-4-7-5-11-.3 2-1.6 3-2.6 3.6C12 14 13.7 5 13 0Z"
              fill="url(#wflame)"
            />
          </svg>
          T A
        </a>
        <div className="nav-links">
          <a href="#about">About WOTA</a>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#gallery">Gallery</a>
        </div>
        <div className="nav-right">
          <a href="#contact" className="btn btn-line" onClick={close}>
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
          </a>
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
          <a href="#about" onClick={close}>
            About WOTA
          </a>
          <a href="#services" onClick={close}>
            Services
          </a>
          <a href="#projects" onClick={close}>
            Projects
          </a>
          <a href="#gallery" onClick={close}>
            Gallery
          </a>
        </div>
      </div>
    </nav>
  );
}
