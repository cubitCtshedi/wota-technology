import { useState, useRef, useEffect } from 'react';
import { faqs } from '../data/faqs';

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
          <h2>
            Have Questions
            <br />
            About WOTA?
          </h2>
          <div className="faq-list">
            {faqs.map((item, i) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </div>

        <div className="dash" aria-label="Example campaign dashboard">
          <div className="dash-chart">
            <div className="t">
              <div>
                <small>Scans · Campaign week</small>
                <br />
                <b>1 840</b>
              </div>
              <small>▲ live</small>
            </div>
            <div className="bars">
              <i style={{ height: '32%' }}></i>
              <i style={{ height: '48%' }}></i>
              <i className="hot" style={{ height: '92%' }}></i>
              <i style={{ height: '60%' }}></i>
              <i className="cy" style={{ height: '74%' }}></i>
              <i style={{ height: '40%' }}></i>
              <i style={{ height: '26%' }}></i>
            </div>
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
        </div>
      </div>
    </section>
  );
}
