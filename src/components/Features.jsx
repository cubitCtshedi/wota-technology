import { Reveal } from '../lib/motion';

// "Smart. Simple. Powerful." — the dark feature panel with three overlapping cards.
const cards = [
  {
    cls: 'c1',
    title: (
      <>
        Your Brand, Front &amp; Centre
      </>
    ),
    body: 'A full-wrap label designed around your identity or event theme — your look and feel, on something every guest actually wants.',
    img: '/assets/card-bottle-1.png',
  },
  {
    cls: 'c2',
    title: 'Sponsor Real Estate',
    body: 'Partner and sponsor logos printed on the back label alongside the barcode and ingredients — guaranteed hand-held visibility all event long.',
    img: '/assets/card-bottle-2.png',
  },
  {
    cls: 'c3',
    title: 'The Smart QR Code',
    body: 'Links to your programme, menu, offer or sign-up page — and counts every single scan, so your message travels and reports back.',
    img: '/assets/card-bottle-3.png',
  },
];

export default function Features() {
  return (
    <section id="about" className="feat-section">
      <div className="wrap">
        <div className="feat-panel">
          <Reveal className="dp-head">
            <h2>
              Smart<span>.</span> Simple<span>.</span>
              <br />
              Powerful<span>.</span>
            </h2>
            <p>
              WOTA turns every bottle into a smart marketing channel — built for results, designed for
              impact.
            </p>
          </Reveal>
        </div>
        <div className="dp-cards">
          {cards.map((c, i) => (
            <Reveal key={c.cls} className={`dp-card ${c.cls}`} delay={i * 0.12}>
              <div className="dp-txt">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="card-media">
                <img src={c.img} alt="" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
