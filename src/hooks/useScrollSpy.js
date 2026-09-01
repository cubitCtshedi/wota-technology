import { useEffect, useState } from 'react';

// Pure decision rule, split out from the effect so it can be tested without a
// layout engine. `rects` is [{ id, top, bottom }] in document order, viewport
// relative; `line` is the y the section top must cross to become current.
//
// Sections the nav doesn't link to (the steps list, the FAQ, the closing CTA)
// sit between and after the tracked ones. Holding the last match keeps the
// highlight steady while passing through one in the middle — but once the
// final tracked section has scrolled by there is genuinely nothing to point
// at, so it clears rather than leaving Gallery lit for the rest of the page.
export function pickActive(rects, line) {
  let current = null;
  let currentBottom = 0;
  for (const { id, top, bottom } of rects) {
    if (top <= line) {
      current = id;
      currentBottom = bottom;
    }
  }
  const last = rects[rects.length - 1];
  if (last && current === last.id && currentBottom < line) return null;
  return current;
}

// Which of the tracked sections the reader is currently in, so the nav can
// highlight it. Returns a section id, or null when nothing applies.
//
// Pass a stable array — a fresh literal on every render would re-run the effect
// and rebind the listener each time.
export function useScrollSpy(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!ids.length) {
      setActive(null);
      return undefined;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;

      // The trigger line sits just under the floating nav pill, so a section
      // becomes current when its top slides beneath the nav — not when it
      // first peeks in at the bottom of the screen. Measured rather than
      // hard-coded because the pill shrinks on small screens.
      const pill = document.querySelector('.nav-inner');
      const line = (pill ? pill.getBoundingClientRect().bottom : 78) + 30;

      const rects = [];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        rects.push({ id, top, bottom });
      }

      setActive(pickActive(rects, line));
    };

    // Scroll fires far faster than the screen repaints; coalescing into one
    // rAF keeps this to a single layout read per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);

  return active;
}
