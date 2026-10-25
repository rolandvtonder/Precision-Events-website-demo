/*
  Scroll choreography, carried over from the Marlin reference.

  The reference's motion prototype ran 20,000ms; every window below is that
  timeline divided by 20,000, so sections land at the same relative moments —
  only the clock is the scrollbar instead of a timer.

      0 – 650ms        hero words and body lines stagger in (75ms apart)
      200 – 2284ms     the bookings card rises in
      3000 – 3600ms    the four service cards arrive
      8000 – 14000ms   first transition: hero out, services settle
      15500ms – 0.90   second transition: services out, About settles

  The hero also plays its reveal on load (INTRO_END), so the first screen is
  never empty before the visitor scrolls.
*/

export const TOTAL_MS = 20000
export const SCROLL_VH = 620

export const at = (ms: number) => ms / TOTAL_MS

/** Phase windows as scroll progress. */
export const P = {
  /* the hero's three words, 75ms apart, 300ms each */
  words: [
    [at(0), at(300)],
    [at(75), at(375)],
    [at(150), at(450)],
  ],
  /* the bookings card: t=200ms, 2084ms slow ease */
  stat: [at(200), at(2284)],
  /* service cards arrive */
  g54In: [at(3000), at(3600)],
  /* the 6000ms transition */
  move1: [at(8000), at(14000)],
  /* the 4500ms transition, landing at 0.90 so About holds before the gallery */
  move2: [at(15500), 0.9],
  /* photo crossfades, riding inside each transition */
  bg2: [at(9000), at(11500)],
  bg3: [at(15500), at(17500)],
} as const

/** Body lines follow the words at 200ms, 75ms apart. */
export const bodyWindow = (i: number) => [at(200 + 75 * i), at(500 + 75 * i)] as const

/** How far the load-time intro plays the hero in. */
export const INTRO_END = at(2400)

/** 0 before `a`, 1 after `b`, cubic-eased between. */
export function span(p: number, [a, b]: readonly [number, number]) {
  if (p <= a) return 0
  if (p >= b) return 1
  const t = (p - a) / (b - a)
  return 1 - Math.pow(1 - t, 3)
}

/** Linear ramp, for positions that should track the scrollbar exactly. */
export function ramp(p: number, [a, b]: readonly [number, number]) {
  if (p <= a) return 0
  if (p >= b) return 1
  return (p - a) / (b - a)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
