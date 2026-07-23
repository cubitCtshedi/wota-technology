// Case-study tabs for the "Real Projects. Real Hands. Real Engagement." section.
// `id` matches the original panel ids so tab order/behaviour is unchanged.
export const projects = [
  {
    id: 'p1',
    tab: '🏦 Corporate Event',
    tag: 'Project — Corporate Event',
    title: 'A corporate summit, with the programme in every hand',
    body: (
      <>
        <p>
          Every delegate received a WOTA bottle: the host's brand on the front; the event's beverage,
          tech and hospitality sponsors on the back alongside the barcode.
        </p>
        <p>
          The QR code opened the day's <strong>agenda and speaker line-up</strong> — no printed
          programmes needed. Midway through the day, the same link updated to point to the afternoon
          breakaway sessions.
        </p>
        <p>
          The client walked away knowing not just that bottles were handed out, but how many delegates
          actively engaged with the programme — and its sponsors had proof of visibility to show their
          boards.
        </p>
      </>
    ),
    stats: [
      ['Bottles distributed', '800'],
      ['Agenda scans', '612'],
      ['Scan-through rate', '76%'],
      ['Sponsor logos in hand', '6'],
    ],
  },
  {
    id: 'p2',
    tab: '⛳ Golf Event',
    tag: 'Project — Golf Event',
    title: 'A golf day, bottled',
    body: (
      <>
        <p>
          Bottles were placed on the golf carts and at the halfway stations. Front label: the
          tournament branding. Back label: the day's sponsors, printed alongside the barcode.
        </p>
        <p>
          The QR code opened the <strong>course information and the day's programme</strong>, so players
          scanned repeatedly through the round. After the prize-giving, the same code switched to the
          photo gallery.
        </p>
        <p>
          Repeat scanning is the point: a golf day bottle is engaged with over four hours, not four
          seconds.
        </p>
      </>
    ),
    stats: [
      ['Bottles on course', '400'],
      ['Total scans', '1 130'],
      ['Scans per bottle', '2.8×'],
      ['Quote requests', '57'],
    ],
  },
  {
    id: 'p5',
    tab: '❤️ Charity Event',
    tag: 'Project — Charity Event',
    title: 'Every bottle carried the cause',
    body: (
      <>
        <p>
          At a charity fundraiser, the cause's branding took the front label while the event's
          supporting sponsors shared the back — visibility that thanked them in every guest's hand.
        </p>
        <p>
          The QR code opened the <strong>story of the cause and a donation page</strong>, so a moment of
          refreshment became a moment of giving. Guests could contribute right from their seats, no
          pledge forms needed.
        </p>
        <p>
          After the event, the same link showed the impact update — where the funds went — keeping
          donors connected to the outcome.
        </p>
      </>
    ),
    stats: [
      ['Bottles distributed', '—'],
      ['Story scans', '—'],
      ['Donations via QR', '—'],
      ['Sponsor logos in hand', '—'],
    ],
  },
  {
    id: 'p3',
    tab: '🎉 Brand Activation',
    tag: 'Project — Brand Activation',
    title: 'Taking a brand into new hands',
    body: (
      <>
        <p>
          A promotional team handed out bottles carrying the brand's launch look-and-feel on the front,
          with retail partners on the back.
        </p>
        <p>
          The QR code opened a <strong>competition entry form</strong>: scan, enter your details, stand a
          chance to win. Every entry became an opted-in contact in the brand's database.
        </p>
        <p>
          After the activation, every entrant received a follow-up offer by email — the campaign kept
          converting long after the last bottle was empty.
        </p>
      </>
    ),
    stats: [
      ['Bottles distributed', '3 000'],
      ['Competition entries', '1 240'],
      ['New database contacts', '1 240'],
      ['Voucher redemptions', '318'],
    ],
  },
  {
    id: 'p4',
    tab: '🥂 Private Function',
    tag: 'Project — Private Function',
    title: 'A celebration with its own label',
    body: (
      <>
        <p>
          Bottles carried the host's custom party branding — the theme on the front, the evening's
          drinks sponsors on the back.
        </p>
        <p>
          The QR code opened the <strong>evening's menu</strong>, and later switched to a shared photo
          album where guests uploaded their pictures from the night.
        </p>
        <p>
          Small event, same technology: the bottle became a keepsake that kept the celebration
          connected.
        </p>
      </>
    ),
    stats: [
      ['Bottles on tables', '150'],
      ['Menu scans', '96'],
      ['Photos uploaded', '210'],
      ['Printed menus needed', '0'],
    ],
  },
];
