import { useEffect, useState } from 'react';

const LAND = 4.0; // seconds — the moment the bottle lands in the loop

// Reveals the giant WOTA word when the bottle lands (~4s into the loop) and
// hides it again as the bottle rises each cycle. Honours reduced-motion by
// holding the poster frame and simply showing the word.
export function useHeroWord(videoRef) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (vid) {
        vid.removeAttribute('autoplay');
        vid.pause();
      }
      setShow(true);
      return;
    }

    if (!vid) return;
    const onTime = () => setShow(vid.currentTime >= LAND);
    vid.addEventListener('timeupdate', onTime);
    return () => vid.removeEventListener('timeupdate', onTime);
  }, [videoRef]);

  return show;
}
