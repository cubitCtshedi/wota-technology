import { services } from '../data/services';

// "Services Built Around One Powerful Vehicle" — the 7-card grid.
export default function Services() {
  return (
    <section id="services" style={{ paddingTop: '20px' }}>
      <div className="wrap">
        <h2>
          Services Built Around
          <br />
          One Powerful Vehicle
        </h2>
        <p className="muted" style={{ maxWidth: '560px', marginTop: '1rem' }}>
          We are a marketing company. The bottle is our medium — the message, the sponsors, the data
          and the follow-up are the product.
        </p>
        <div className="svc-grid">
          {services.map((s) => (
            <div key={s.title} className="svc reveal">
              <div className="ic">
                <svg viewBox="0 0 24 24">{s.icon}</svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
