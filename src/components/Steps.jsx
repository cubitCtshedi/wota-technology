import { steps } from '../data/steps';
import { Reveal } from '../lib/motion';

// "4 Quick Steps From Bottle To Dashboard" — bottle stage + numbered list.
export default function Steps() {
  return (
    <section>
      <div className="wrap steps-grid">
        <div className="stage" style={{ minHeight: '520px' }}>
          <div className="orbit o1">
            <span className="dot"></span>
          </div>
          <div className="orbit o2">
            <span className="dot"></span>
          </div>
          {/* Intrinsic width/height let the browser reserve the right box before
              the image loads — CSS sizes it by height, so the ratio comes from
              these. Section sits well below the fold, hence lazy. */}
          <img
            className="real-bottle"
            src="/assets/bottle-still-water.webp"
            width="394"
            height="1400"
            loading="lazy"
            decoding="async"
            alt="A WOTA still water bottle with the brand label on the front"
          />
          <div className="fcard fc1" style={{ top: '8%' }}>
            <span className="fic">✓</span>
            <span>
              <b>642 Leads Captured</b>
              <small>This campaign</small>
            </span>
          </div>
        </div>
        <div>
          <Reveal as="h2">
            4 Quick Steps
            <br />
            From Bottle To Dashboard
          </Reveal>
          <ul className="steps-list" style={{ marginTop: '2.2rem' }}>
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} className={s.hot ? 'hot' : undefined} delay={i * 0.1}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
