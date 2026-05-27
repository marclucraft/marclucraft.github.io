/* =====================================================================
 * Product catalog for the UnoSignal Skate Store.
 * Kept as a plain JS array so the demo stays simple and easy to edit.
 * Image URLs use a public placeholder service so the site renders
 * without bundling any binary assets.
 * ===================================================================== */

window.PRODUCTS = [
  {
    id: "deck-signal-wave",
    name: "Signal Wave Deck",
    category: "decks",
    price: 79.99,
    image: "https://picsum.photos/seed/signalwave/600/600",
    description: '8.25" classic shape with a screaming hand graphic.',
    tag: "New",
  },
  {
    id: "deck-push-classic",
    name: "Push Classic Deck",
    category: "decks",
    price: 74.99,
    image: "https://picsum.photos/seed/pushclassic/600/600",
    description: '8.0" popsicle, perfect for street and park.',
    tag: null,
  },
  {
    id: "complete-engagement",
    name: "Engagement Complete",
    category: "completes",
    price: 129.99,
    image: "https://picsum.photos/seed/engagement/600/600",
    description: "Fully built complete with 52mm wheels and Bones bearings.",
    tag: "Bestseller",
  },
  {
    id: "complete-broadcast",
    name: "Broadcast Cruiser",
    category: "completes",
    price: 149.99,
    image: "https://picsum.photos/seed/broadcast/600/600",
    description: "Soft 60mm wheels for a smooth city ride.",
    tag: null,
  },
  {
    id: "tee-screaming-bell",
    name: "Screaming Bell Tee",
    category: "clothing",
    price: 32.0,
    image: "https://picsum.photos/seed/screamingbell/600/600",
    description: "Heavyweight cotton tee, screen-printed in the UK.",
    tag: null,
  },
  {
    id: "hoodie-segment",
    name: "Segment Hoodie",
    category: "clothing",
    price: 64.0,
    image: "images/hoody.png",
    description: "Heavy fleece hoodie with embroidered chest logo.",
    tag: "New",
  },
  {
    id: "cap-trigger",
    name: "Trigger Cap",
    category: "clothing",
    price: 28.0,
    image: "images/hat.jpg",
    description: "Flat peak snapback with a woven UnoSignal patch.",
    tag: null,
  },
  {
    id: "wheels-journey",
    name: "Journey Wheels (Set of 4)",
    category: "accessories",
    price: 36.0,
    image: "https://picsum.photos/seed/journey/600/600",
    description: "53mm / 99a all-terrain wheels.",
    tag: null,
  },
];

window.findProduct = function (id) {
  return window.PRODUCTS.find(function (p) {
    return p.id === id;
  });
};
