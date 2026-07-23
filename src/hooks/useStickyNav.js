import { useEffect, useState } from 'react';

// Transparent nav over the hero, solid white once you scroll past 30px.
export function useStickyNav(threshold = 30) {
  const [scrolled, setScrolled] = useState(
    typeof window !== 'undefined' && window.scrollY > threshold
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
