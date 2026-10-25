/*
  Every word, number and photo on the site lives here, so copy can be changed
  without touching the layout.

  DRAFT: the services and About copy below was written from the Facebook page
  and the photos. Replace it with the family's own words when they are ready.
*/

/* One accent only — the uniform purple, lifted to read on near-black. */
export const ACCENT = '#b48cff'
export const INK = '#0d0b12'
export const INK_DEEP = '#09070d'

export const PHONE = {
  display: '062 026 7063',
  tel: 'tel:+27620267063',
  whatsapp: 'https://wa.me/27620267063',
}

export const quoteLink = (what: string) =>
  `${PHONE.whatsapp}?text=${encodeURIComponent(`Hi Precision Events, I'd like a quote for ${what}.`)}`

export const ADDRESS = ['56 Halt Road', 'Elsies River', 'Cape Town, South Africa']
export const FACEBOOK = 'https://www.facebook.com/p/Precision-Events-100041524646037/'

export const HERO = {
  words: ['Crafted', 'With', 'Care'],
  lines: {
    desktop: [
      'Family-run catering from Elsies River, Cape Town.',
      'Buffets, platters and plated meals for every',
      'celebration, at a price that works for you.',
    ],
    mobile: [
      'Family-run catering from Elsies River,',
      'Cape Town. Buffets, platters and plated',
      'meals for every celebration, at a price',
      'that works for you.',
    ],
  },
  facts: [
    ['Buffets', 'Hot & cold'],
    ['Platters', 'Made to order'],
    ['Pricing', 'Negotiable'],
  ],
}

export const SERVICES = {
  title: 'What We Serve',
  body: 'From church functions to birthdays at home, we cook, set up and serve, so you can spend the day with your guests.',
  cards: [
    { label: ['Buffet', 'Catering'], art: 'team-buffet', quote: 'buffet catering', alt: 'The Precision Events team in purple uniforms behind a full buffet' },
    { label: ['Platters', '& Spreads'], art: 'chicken-spread', quote: 'a platter or spread', alt: 'Trays of grilled chicken with salads, peppers and wraps' },
    { label: ['Home', 'Functions'], art: 'serving-guests', quote: 'a home function', alt: 'Guests served from a salad and chicken buffet at home' },
    { label: ['Plated', 'Meals'], art: 'plated-meal', quote: 'plated meals', alt: 'A plate of grilled chicken, salad and pap' },
  ],
}

export const ABOUT = {
  title: 'A family that loves to feed people',
  body: 'Precision Events started with a family and their talent in the kitchen. Every dish is cooked by our own team, the same people you will see behind the buffet in purple, and our prices are negotiable, so good food fits your budget.',
}

export const GALLERY = [
  { src: 'team-buffet', w: 1280, h: 960, alt: 'The Precision Events team lined up behind a buffet of beef, chicken, potatoes, rice and salads' },
  { src: 'chicken-spread', w: 720, h: 960, alt: 'Grilled chicken breasts on trays beside cucumber, tomato and onion salads' },
  { src: 'plated-meal', w: 960, h: 840, alt: 'A plate of grilled chicken, salad and pap being served' },
  { src: 'serving-guests', w: 720, h: 960, alt: 'A team member serving salad to guests' },
  { src: 'guest-plate', w: 720, h: 960, alt: 'A guest dishing up from the buffet table' },
]

/* Scene backgrounds, in order: hero, services, About. */
export const BACKDROPS = ['team-buffet', 'guest-plate', 'serving-guests']

/* Photos resolve against Vite's base, so the site works from a sub-path
   such as GitHub Pages as well as from a domain root. */
export const photo = (name: string) => `${import.meta.env.BASE_URL}assets/${name}.jpg`
