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
        <source src="/assets/wota-bg.webm" type="video/webm" />
        <source src="/assets/wota-bg.mp4" type="video/mp4" />
      </video>
      <div className={`hero-word${showWord ? ' show' : ''}`} aria-hidden="true">
        WOTA
      </div>
    </header>
  );
}
