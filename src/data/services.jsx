// Each service card in the "Services Built Around One Powerful Vehicle" grid.
// `icon` is the inner SVG markup for the icon badge (same paths as the original).
export const services = [
  {
    title: 'Branded Bottle Campaigns',
    body: 'Custom-labelled water bottles carrying your identity, campaign message and call to action — designed, printed and delivered.',
    icon: <path d="M12 2c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z" />,
  },
  {
    title: 'Smart QR Engagement',
    body: 'Every bottle carries a trackable QR code linking to your programme, agenda, menu, offer or landing page. One scan, one measurable lead.',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM18 18h3v3h-3z" />
      </>
    ),
  },
  {
    title: 'Engagement Analytics',
    body: 'A campaign dashboard showing total scans, unique reach, scan-through rates and peak engagement times — proof, not guesswork.',
    icon: (
      <>
        <path d="M3 17l5-5 4 4 8-8" />
        <path d="M14 8h6v6" />
      </>
    ),
  },
  {
    title: 'Sponsor Visibility Packages',
    body: 'Back-label real estate for event sponsors and partners — printed alongside the barcode for guaranteed hand-held visibility.',
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <circle cx="17.5" cy="9" r="2.5" />
        <path d="M16 14.3c3 .3 5.5 2.4 5.5 5.7" />
      </>
    ),
  },
  {
    title: 'Lead Capture & Database Building',
    body: 'Scans can feed a sign-up form or competition entry, building an opted-in customer database ready for retargeting after the event ends.',
    icon: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M4 8l8 5 8-5" />
      </>
    ),
  },
  {
    title: 'Newsletter & Ongoing Engagement',
    body: 'Guests who scan can subscribe to your newsletter — collect emails at the event and stay in touch with updates, offers and news long after it ends.',
    icon: (
      <>
        <path d="M21 4L11 14" />
        <path d="M21 4l-6.5 17-3.5-7-7-3.5z" />
      </>
    ),
  },
  {
    title: 'End-To-End Campaign Management',
    body: 'From label design and QR setup to delivery logistics and the post-event performance report — one partner, one accountable team.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
];
