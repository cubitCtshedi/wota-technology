import { useRef, useState, useEffect } from 'react';
import { useHeroWord } from '../hooks/useHeroWord';
import { Reveal } from '../lib/motion';

export default function Hero() {
  const videoRef = useRef(null);
  const showWord = useHeroWord(videoRef);

  // Reveal the banner content in sync with the giant WOTA word — but latch it
  // so it stays once shown (the word itself re-hides each loop cycle).
  const [contentIn, setContentIn] = useState(false);
  useEffect(() => {
    if (showWord) setContentIn(true);
  }, [showWord]);

  return (
    <header className="hero" id="top">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/assets/wota-bg-poster.jpg"
        aria-hidden="true"
      >
        {/* mp4 first: it's ~1.2 MB and plays everywhere, vs the 2.9 MB webm.
            Browsers use the first source they support, so this is the smaller download. */}
        <source src="/assets/wota-bg.mp4" type="video/mp4" />
        <source src="/assets/wota-bg.webm" type="video/webm" />
      </video>
      <div className={`hero-word${showWord ? ' show' : ''}`} aria-hidden="true">
        WOTA
      </div>

      <div className="hero-overlay">
        <Reveal className="hero-feat hero-feat-left" x={-48} y={0} delay={0} duration={0.9} show={contentIn}>
          <span className="hf-icon">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path className="brk" d="M4 14V4h10M44 14V4H34M4 34v10h10M44 34v10H34" />
              <path
                className="glyph"
                d="M21 15h6M22 15v-3h4v3M20 19c0-2 1-4 4-4s4 2 4 4v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V19Z"
              />
            </svg>
          </span>
          <h2 className="hf-title">
            Your Brand
            <br />
            in Every Hand
          </h2>
          <span className="hf-rule" />
          <p className="hf-desc">
            Custom branded bottles that turn every guest into a moving billboard.
          </p>
        </Reveal>

        <Reveal className="hero-feat hero-feat-right" x={48} y={0} delay={0.15} duration={0.9} show={contentIn}>
          <span className="hf-icon">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path className="brk" d="M4 14V4h10M44 14V4H34M4 34v10h10M44 34v10H34" />
              <path
                className="glyph"
                d="M15 15h6v6h-6zM27 15h6v6h-6zM15 27h6v6h-6zM27 27h3v3h-3zM33 27v3M27 33h6"
              />
            </svg>
          </span>
          <h2 className="hf-title">
            Smart QR
            <br />
            Engagement
          </h2>
          <span className="hf-rule" />
          <p className="hf-desc">
            Every scan is tracked. Every interaction is measurable.
          </p>
        </Reveal>

        <Reveal className="hero-stats" y={40} delay={0.3} duration={0.9} show={contentIn}>
          <div className="hstat">
            <span className="hstat-ic">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20V10M9 20v-7M14 20v-4M19 20V6M4 9l5-4 5 3 6-5" />
              </svg>
            </span>
            <div className="hstat-txt">
              <b>1 840</b>
              <span>Scans</span>
              <small>Campaign Week</small>
            </div>
          </div>
          <span className="hstat-div" />
          <div className="hstat">
            <span className="hstat-ic">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M16.5 14.2A5.5 5.5 0 0 1 21 20" />
              </svg>
            </span>
            <div className="hstat-txt">
              <b>642</b>
              <span>Leads Captured</span>
              <small>This Campaign</small>
            </div>
          </div>
          <span className="hstat-div" />
          <div className="hstat">
            <span className="hstat-ic">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
              </svg>
            </span>
            <div className="hstat-txt">
              <b>238</b>
              <span>Newsletter Sign-ups</span>
              <small>Opted-in Contacts</small>
            </div>
          </div>
          <span className="hstat-div" />
          <div className="hstat">
            <span className="hstat-ic">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h.01" />
              </svg>
            </span>
            <div className="hstat-txt">
              <b>76%</b>
              <span>Scan-through Rate</span>
              <small>Engagement</small>
            </div>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
