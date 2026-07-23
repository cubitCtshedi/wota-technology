import { steps } from '../data/steps';

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
          <img
            className="real-bottle"
            src="/assets/bottle-cut.png"
            alt="WOTA branded water bottle"
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
          <h2>
            4 Quick Steps
            <br />
            From Bottle To Dashboard
          </h2>
          <ul className="steps-list" style={{ marginTop: '2.2rem' }}>
            {steps.map((s) => (
              <li key={s.title} className={`reveal${s.hot ? ' hot' : ''}`}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
