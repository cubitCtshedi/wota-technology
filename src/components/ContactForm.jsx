import { useRef, useState } from 'react';

const INTERESTS = [
  'Event or activation',
  'Sponsorship',
  'Bulk / branded order',
  'Partnership',
  'Media & press',
  'Something else',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{6,}$/; // loose: digits/space/()/-/+, 7+ chars
const CONTACT_EMAIL = 'info@wota.africa';
const ENDPOINT = '/contact.php';

// Field length bounds — kept in sync with the same limits in contact.php.
const LIMITS = { name: 80, email: 120, company: 100, phone: 30, message: 2000 };

const empty = {
  name: '',
  email: '',
  company: '',
  phone: '',
  interest: '',
  message: '',
  consent: false,
  website: '', // honeypot — must stay empty
};

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const mountedAt = useRef(Date.now()); // for the server-side time-trap

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate a single field — used both on blur and on submit.
  const validateField = (field, v) => {
    switch (field) {
      case 'name': {
        const s = v.name.trim();
        if (!s) return 'Please tell us your name.';
        if (s.length < 2) return 'That looks a little short.';
        if (s.length > LIMITS.name) return 'That name is too long.';
        return undefined;
      }
      case 'email': {
        const s = v.email.trim();
        if (!s) return 'We need an email to reply to.';
        if (!EMAIL_RE.test(s) || s.length > LIMITS.email) return 'That email doesn’t look right.';
        return undefined;
      }
      case 'phone': {
        const s = v.phone.trim();
        if (s && !PHONE_RE.test(s)) return 'That phone number looks off.';
        return undefined;
      }
      case 'interest':
        if (!v.interest) return 'Pick the option that fits best.';
        if (!INTERESTS.includes(v.interest)) return 'Pick the option that fits best.';
        return undefined;
      case 'message': {
        const s = v.message.trim();
        if (!s) return 'A short message helps us prepare.';
        if (s.length < 10) return 'A little more detail, please.';
        if (s.length > LIMITS.message) return 'That’s a bit long — please trim it down.';
        return undefined;
      }
      case 'consent':
        return v.consent ? undefined : 'Please allow us to get back to you.';
      default:
        return undefined;
    }
  };

  // Show a field's error when the user leaves it.
  const onBlur = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values) }));
  };

  const validate = () => {
    const next = {};
    for (const field of ['name', 'email', 'phone', 'interest', 'message', 'consent']) {
      const err = validateField(field, values);
      if (err) next[field] = err;
    }
    return next;
  };

  const mailtoHref = () => {
    const subject = `WOTA enquiry — ${values.interest || 'General'}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.company && `Company: ${values.company}`,
      values.phone && `Phone: ${values.phone}`,
      values.interest && `Interest: ${values.interest}`,
      '',
      values.message,
    ]
      .filter(Boolean)
      .join('\n');
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body,
    )}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          elapsed: Math.round((Date.now() - mountedAt.current) / 1000),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus('sent');
        return;
      }
      // server-side field validation echoed back
      if (res.status === 422 && Array.isArray(data.fields)) {
        const mapped = {};
        data.fields.forEach((f) => (mapped[f] = 'Please check this field.'));
        setErrors(mapped);
        setStatus('idle');
        return;
      }
      setStatus('error');
    } catch {
      // network error / endpoint unreachable (e.g. local `vite dev` with no PHP)
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-card form-done" role="status">
        <div className="form-done-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M4 12.5l5 5L20 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3>Thanks, {values.name.split(' ')[0] || 'there'}!</h3>
        <p>
          Your message is on its way — we’ll get back to you within one business day at{' '}
          <b>{values.email}</b>.
        </p>
        <button
          type="button"
          className="btn btn-black"
          onClick={() => {
            setValues(empty);
            setStatus('idle');
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      {status === 'error' && (
        <div className="form-alert" role="alert">
          Something went wrong sending your message. Please try again, or email us directly at{' '}
          <a href={mailtoHref()}>{CONTACT_EMAIL}</a>.
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-name">Full name *</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={update}
            onBlur={onBlur}
            aria-invalid={errors.name ? 'true' : undefined}
            placeholder="Jane Mokoena"
          />
          {errors.name && <span className="field-err">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email *</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={update}
            onBlur={onBlur}
            aria-invalid={errors.email ? 'true' : undefined}
            placeholder="jane@brand.com"
          />
          {errors.email && <span className="field-err">{errors.email}</span>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-company">Company / organisation</label>
          <input
            id="cf-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={values.company}
            onChange={update}
            placeholder="Optional"
          />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Phone</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            value={values.phone}
            onChange={update}
            onBlur={onBlur}
            aria-invalid={errors.phone ? 'true' : undefined}
            placeholder="Optional"
          />
          {errors.phone && <span className="field-err">{errors.phone}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-interest">What’s this about? *</label>
        <select
          id="cf-interest"
          name="interest"
          value={values.interest}
          onChange={update}
          onBlur={onBlur}
          aria-invalid={errors.interest ? 'true' : undefined}
        >
          <option value="" disabled>
            Choose one…
          </option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        {errors.interest && <span className="field-err">{errors.interest}</span>}
      </div>

      <div className="field">
        <label htmlFor="cf-message">Message *</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          maxLength={LIMITS.message}
          value={values.message}
          onChange={update}
          onBlur={onBlur}
          aria-invalid={errors.message ? 'true' : undefined}
          placeholder="Tell us about your event, activation or the brands involved…"
        />
        {errors.message && <span className="field-err">{errors.message}</span>}
      </div>

      {/* honeypot: hidden from people, tempting to bots */}
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={update}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      />

      <label className="field-check">
        <input name="consent" type="checkbox" checked={values.consent} onChange={update} />
        <span>I’m happy for WOTA to contact me about this enquiry.</span>
      </label>
      {errors.consent && <span className="field-err">{errors.consent}</span>}

      <button type="submit" className="btn btn-black form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  );
}
