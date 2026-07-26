import { useState, useRef, useEffect } from 'react';
import { m } from 'framer-motion';
import { faqs } from '../data/faqs';
import { Reveal } from '../lib/motion';

// Weekly scan bars — [height, optional colour class]
const bars = [
  ['32%'],
  ['48%'],
  ['92%', 'hot'],
  ['60%'],
  ['74%', 'cy'],
  ['40%'],
  ['26%'],
];

function FaqItem({ q, a, open, onToggle }) {
  const answerRef = useRef(null);

  // Drive the max-height transition off the answer's natural height, exactly
  // like the original vanilla accordion did.
  useEffect(() => {
    const el = answerRef.current;
    if (el) el.style.maxHeight = open ? `${el.scrollHeight}px` : null;
  }, [open]);

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={onToggle}>
        {q}
        <span className="pm">+</span>
      </button>
      <div className="faq-a" ref={answerRef}>
        <p>{a}</p>
      </div>
    </div>
  );
}

// "Have Questions About WOTA?" — accordion beside the campaign dashboard mock.
export default function FaqDashboard() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={{ paddingTop: '20px' }}>
      <div className="wrap faq-grid">
        <div>
          <Reveal as="h2">
            Have Questions
            <br />
            About WOTA?
          </Reveal>
          <div className="faq-list">
            {faqs.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06}>
                <FaqItem
                  q={item.q}
                  a={item.a}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="dash" aria-label="Example campaign dashboard" delay={0.1}>
          <div className="dash-chart">
            <div className="t">
              <div>
                <small>Scans · Campaign week</small>
                <br />
                <b>1 840</b>
              </div>
              <small>▲ live</small>
            </div>
            <m.div
              className="bars"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
              }}
            >
              {bars.map(([h, cls], i) => (
                <m.i
                  key={i}
                  className={cls}
                  style={{ height: h }}
                  variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </m.div>
            <div className="bar-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          <div className="dash-panel">
            <div className="act">
              <span className="aic">▣</span>
              <span>
                <b>Programme Opened</b>
                <small>QR scan · main stage bottles</small>
              </span>
              <span className="num">+612</span>
            </div>
            <div className="act">
              <span className="aic">✉</span>
              <span>
                <b>Newsletter Sign-ups</b>
                <small>Opted-in contacts</small>
              </span>
              <span className="num">+238</span>
            </div>
            <div className="act">
              <span className="aic">✓</span>
              <span>
                <b>Leads Captured</b>
                <small>Competition entries</small>
              </span>
              <span className="num">+642</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
