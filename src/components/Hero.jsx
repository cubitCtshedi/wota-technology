import { useRef } from 'react';
import { useHeroWord } from '../hooks/useHeroWord';

export default function Hero() {
  const videoRef = useRef(null);
  const showWord = useHeroWord(videoRef);

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
    </header>
  );
}
