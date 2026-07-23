import { useStickyNav } from '../hooks/useStickyNav';

export default function Nav() {
  const scrolled = useStickyNav();

  return (
    <nav className={scrolled ? 'scrolled' : undefined}>
      <div className="wrap nav-inner">
        <a className="logo" href="#top" aria-label="WOTA">
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
          <a href="#services">Products</a>
          <a href="#about">About WOTA</a>
          <a href="#faq">Sustainability</a>
          <a href="#projects">Gallery</a>
        </div>
        <div className="nav-right">
          <a href="#contact" className="btn btn-line">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
