import { Reveal } from '../lib/motion';

// "Start Your Campaign Now" — closing call-to-action panel.
export default function Cta() {
  return (
    <section id="contact" style={{ paddingTop: '20px' }}>
      <div className="wrap">
        <Reveal className="cta-panel">
          <div className="cta-bottles" aria-hidden="true">
            <img className="b-back" src="/assets/white-bottle-cut.png" alt="" />
            <img className="b-front" src="/assets/bottle-cut.png" alt="" />
          </div>
          <div className="cta-copy">
            <h2>
              Start Your
              <br />
              Campaign Now
            </h2>
            <p>
              Tell us about your event, activation or sponsorship — we'll design the bottle, load the QR
              destination and set up your engagement dashboard.
            </p>
            <a className="btn btn-white" href="mailto:hello@wota.technology">
              Get In Touch →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
