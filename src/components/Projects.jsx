import { useState } from 'react';
import { projects } from '../data/projects';
import { Reveal } from '../lib/motion';

// "Real Projects. Real Hands. Real Engagement." — tabbed case studies.
export default function Projects() {
  const [active, setActive] = useState(projects[0].id);

  return (
    <section id="projects" style={{ paddingTop: '20px' }}>
      <div className="wrap">
        <Reveal as="h2">
          Real Projects. Real Hands.
          <br />
          Real Engagement.
        </Reveal>
        <Reveal as="p" className="muted" style={{ maxWidth: '560px', marginTop: '1rem' }} delay={0.08}>
          One vehicle, many missions — here's how WOTA bottles have carried the message at the events
          and activations we've delivered.
        </Reveal>

        <Reveal className="case-tabs" role="tablist" delay={0.12}>
          {projects.map((p) => (
            <button
              key={p.id}
              className={`case-tab${active === p.id ? ' active' : ''}`}
              role="tab"
              aria-selected={active === p.id}
              onClick={() => setActive(p.id)}
            >
              {p.tab}
            </button>
          ))}
        </Reveal>

        {projects.map((p) => (
          <div
            key={p.id}
            className={`case-panel${active === p.id ? ' active' : ''}`}
            id={p.id}
            role="tabpanel"
          >
            <div className="case-body">
              <span className="tag">{p.tag}</span>
              <h3>{p.title}</h3>
              {p.body}
            </div>
            <div className="case-stats">
              {p.stats.map(([label, value]) => (
                <div key={label} className="cs-row">
                  <span className="l">{label}</span>
                  <span className="v">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
