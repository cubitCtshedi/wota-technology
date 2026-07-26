import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { gallery, galleryCategories } from '../data/gallery';
import { Reveal } from '../lib/motion';

// Filterable gallery — pick an event category to see only those shots; click any
// tile to open it in a lightbox.
export default function Gallery() {
  const [cat, setCat] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const items = cat === 'all' ? gallery : gallery.filter((g) => g.cat === cat);

  // Close the lightbox on Escape, and lock body scroll while it's open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  return (
    <section id="gallery" style={{ paddingTop: '20px' }}>
      <div className="wrap">
        <Reveal as="h2">
          The Gallery
        </Reveal>
        <Reveal as="p" className="muted" style={{ maxWidth: '560px', marginTop: '1rem' }} delay={0.08}>
          Every bottle, every hand, every event — a look at WOTA in the wild. Filter by campaign type
          to see the work.
        </Reveal>

        <Reveal className="case-tabs" role="tablist" delay={0.12}>
          {galleryCategories.map((c) => (
            <button
              key={c.id}
              className={`case-tab${cat === c.id ? ' active' : ''}`}
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
            >
              {c.label}
            </button>
          ))}
        </Reveal>

        {/* remount on filter change so the new set animates in cleanly */}
        <div className="gal-grid" key={cat}>
          {items.map((it, i) => (
            <m.button
              key={`${it.src}-${it.title}`}
              type="button"
              className={`gal-item${it.wide ? ' wide' : ''}${it.tall ? ' tall' : ''}`}
              onClick={() => setLightbox(it)}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: (i % 8) * 0.04 }}
            >
              <img src={it.src} alt={`${it.title} — ${it.event}`} loading="lazy" />
              <span className="gal-cap">
                <b>{it.title}</b>
                <small>{it.event}</small>
              </span>
            </m.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <m.div
            className="gal-lightbox"
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button className="gal-close" onClick={() => setLightbox(null)} aria-label="Close">
              ×
            </button>
            <m.figure
              className="gal-figure"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={lightbox.src} alt={`${lightbox.title} — ${lightbox.event}`} />
              <figcaption>
                <b>{lightbox.title}</b>
                <span>{lightbox.event}</span>
              </figcaption>
            </m.figure>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
