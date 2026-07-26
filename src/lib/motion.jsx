import { m } from 'framer-motion';

// Shared scroll-reveal wrapper built on framer-motion's `m` component so it
// works with the app-wide <LazyMotion domAnimation> — only transform + opacity
// animate (GPU-friendly), and `once` detaches the observer after the first pass.
const EASE = [0.22, 1, 0.36, 1];

export function Reveal({
  as = 'div',
  delay = 0,
  y = 34,
  x = 0,
  duration = 0.85,
  // trigger when ~35% of the element is on screen, so the motion plays while
  // you're actually looking at the section rather than finishing off-screen
  amount = 0.35,
  // when `show` is provided the reveal is externally controlled (e.g. synced to
  // another event) instead of firing on scroll-into-view
  show,
  className,
  children,
  ...rest
}) {
  const Comp = m[as];
  const trigger =
    show === undefined
      ? { whileInView: 'visible', viewport: { once: true, amount } }
      : { animate: show ? 'visible' : 'hidden' };
  return (
    <Comp
      className={className}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: { opacity: 1, y: 0, x: 0 },
      }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
