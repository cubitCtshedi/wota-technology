// Gallery categories — two real WOTA campaigns.
export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'group', label: 'The Group' },
  { id: 'n43', label: 'Number 43' },
];

// Gallery items. `wide` spans 2 columns (good for landscape shots), `tall`
// spans 2 rows (good for portrait shots). Ordered for a varied "All" mosaic;
// filtering by category keeps each collection together.
export const gallery = [
  // The Group — M&R Memorial Golf Day (indoor / prize-giving, landscape)
  { cat: 'group', src: '/assets/gallery/group-1.jpeg', title: 'Prize-giving & sponsors', event: 'The Group — M&R Memorial Golf Day', wide: true },
  { cat: 'n43', src: '/assets/gallery/n43-1.jpeg', title: 'Tee-off', event: 'Number 43 — Golf Day', tall: true },
  { cat: 'n43', src: '/assets/gallery/n43-2.jpeg', title: 'On the fairway', event: 'Number 43 — Golf Day' },
  { cat: 'group', src: '/assets/gallery/group-2.jpeg', title: 'WOTA on every table', event: 'The Group — M&R Memorial Golf Day' },
  { cat: 'n43', src: '/assets/gallery/n43-3.jpeg', title: 'Follow-through', event: 'Number 43 — Golf Day', tall: true },
  { cat: 'group', src: '/assets/gallery/group-3.jpeg', title: 'Between the rounds', event: 'The Group — M&R Memorial Golf Day' },
  { cat: 'n43', src: '/assets/gallery/n43-4.jpeg', title: 'The fourball', event: 'Number 43 — Golf Day' },
  { cat: 'group', src: '/assets/gallery/group-4.jpeg', title: 'The Memorial evening', event: 'The Group — M&R Memorial Golf Day', wide: true },
  { cat: 'n43', src: '/assets/gallery/n43-5.jpeg', title: 'Driving the future', event: 'Number 43 — Golf Day', tall: true },
  { cat: 'n43', src: '/assets/gallery/n43-6.jpeg', title: 'At the tee', event: 'Number 43 — Golf Day' },
  { cat: 'n43', src: '/assets/gallery/n43-7.jpeg', title: 'Scan the future', event: 'Number 43 — Golf Day', tall: true },
];
