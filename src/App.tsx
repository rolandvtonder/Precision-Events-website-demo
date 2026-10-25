import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { SCROLL_VH, P, INTRO_END, bodyWindow, span, ramp, lerp } from './scroll'
import { ACCENT, INK, PHONE, HERO, SERVICES, ABOUT, BACKDROPS, quoteLink, photo } from './content'
import Logo from './Logo'
import Gallery from './Gallery'
import Footer from './Footer'

/*
  Precision Events — a scroll-driven scene over the family's own photos.

  Built on the Marlin reference: the page is a fixed artboard of design pixels,
  every element absolutely positioned on it, and scrolling drives a timeline
  (see scroll.ts) rather than moving a page. The reference scrubs two video
  clips; here the backdrop is three photos that slowly push in and crossfade
  inside each transition.

  Two artboards. Desktop is the reference's 1440x810, scaled to the window's
  width so it is full-bleed at every size. A 1440 artboard on a phone would
  set body copy at ~4px, so portrait screens get a 420x900 artboard with the
  same three groups re-laid for a narrow column, contained and centred.
*/

type Layout = {
  W: number
  H: number
  SAFE: number
  G: {
    hero: { start: number; end: number }
    services: { enter: number; mid: number; end: number }
    about: { enter: number; mid: number; end: number }
  }
  hero: {
    wordSize: number
    wordLh: number
    wordBox: number
    wordTops: number[]
    bodyTop: number
    bodyStep: number
    bodySize: number
    bodyLh: number
    buttonsTop: number
    card: { x: number; y: number; scale: number }
  }
  cards: { scale: number; pos: { x: number; y: number }[] }
  services: { titleTop: number; titleSize: number; bodyTop: number; bodySize: number; bodyLh: number; bodyW: number }
  about: {
    ruleTop: number
    headTop: number
    headSize: number
    headLh: number
    headW: number
    bodyX: number
    bodyTop: number
    bodyW: number
  }
}

const DESKTOP: Layout = {
  W: 1440,
  H: 810,
  SAFE: 96,
  /* the reference's measured filmstrip offsets */
  G: {
    hero: { start: 186, end: -774 },
    services: { enter: 1050, mid: 105, end: -1115 },
    about: { enter: 1400, mid: 740, end: 144 },
  },
  hero: {
    wordSize: 72,
    wordLh: 86,
    wordBox: 94,
    wordTops: [-8, 54, 116],
    bodyTop: 264,
    bodyStep: 24,
    bodySize: 16,
    bodyLh: 22,
    buttonsTop: 400,
    card: { x: 1248 - 459, y: 300, scale: 1 },
  },
  cards: {
    scale: 1,
    pos: [
      { x: 0, y: 0 },
      { x: 1248 - 255, y: 0 },
      { x: 116, y: 240 },
      { x: 1248 - 371, y: 240 },
    ],
  },
  services: { titleTop: 470, titleSize: 72, bodyTop: 556, bodySize: 22, bodyLh: 32, bodyW: 680 },
  about: { ruleTop: 404, headTop: 430, headSize: 52, headLh: 54, headW: 600, bodyX: 1248 - 440 - 84, bodyTop: 434, bodyW: 440 },
}

const MOBILE: Layout = {
  W: 420,
  H: 900,
  SAFE: 24,
  G: {
    hero: { start: 128, end: -900 },
    services: { enter: 1100, mid: 190, end: -1100 },
    about: { enter: 1500, mid: 1000, end: 470 },
  },
  hero: {
    wordSize: 46,
    wordLh: 56,
    wordBox: 62,
    wordTops: [0, 42, 84],
    bodyTop: 164,
    bodyStep: 22,
    bodySize: 15,
    bodyLh: 21,
    buttonsTop: 276,
    card: { x: 0, y: 356, scale: 372 / 459 },
  },
  cards: {
    scale: 176 / 255,
    pos: [
      { x: 0, y: 0 },
      { x: 196, y: 0 },
      { x: 0, y: 166 },
      { x: 196, y: 166 },
    ],
  },
  services: { titleTop: 344, titleSize: 31, bodyTop: 390, bodySize: 16, bodyLh: 24, bodyW: 372 },
  about: { ruleTop: 0, headTop: 26, headSize: 32, headLh: 36, headW: 372, bodyX: 0, bodyTop: 150, bodyW: 372 },
}

const px = (n: number) => `${n}px`
const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  position: 'absolute',
  left: px(x),
  top: px(y),
  ...(w != null ? { width: px(w) } : null),
  ...(h != null ? { height: px(h) } : null),
})

/* Where each nav link lands on the timeline: services hold 0.70–0.775, About settles at 0.90. */
const NAV = [
  { t: 'Home', at: 0 },
  { t: 'Services', at: 0.74 },
  { t: 'About', at: 0.96 },
]

/** Reveals behind a clip mask, rising. */
function Mask({ t, children, style }: { t: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ display: 'block', ...style, overflow: 'hidden' }}>
      <span style={{ display: 'block', height: '100%', transform: `translateY(${(1 - t) * 115}%)`, willChange: 'transform' }}>
        {children}
      </span>
    </span>
  )
}

function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function App() {
  const wrap = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ mobile: false, scale: 1, x: 0 })
  const [p, setP] = useState(0)
  const [intro, setIntro] = useState(0)
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(v))

  useLayoutEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const mobile = w < 640 || w / h < 0.9
      if (!mobile) return setFit({ mobile, scale: w / DESKTOP.W, x: 0 })
      /* portrait: contain, then centre the column — the backdrop is viewport-wide anyway */
      const scale = Math.min(w / MOBILE.W, h / MOBILE.H)
      setFit({ mobile, scale, x: (w - MOBILE.W * scale) / 2 })
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Play the hero in on load, so the first screen is never empty. */
  useEffect(() => {
    if (reduce) return setIntro(1)
    let raf = 0
    const t0 = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 1800)
      setIntro(k)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  const L = fit.mobile ? MOBILE : DESKTOP
  const GW = L.W - L.SAFE * 2
  const lines = fit.mobile ? HERO.lines.mobile : HERO.lines.desktop

  /* hero reveals run on whichever is further along: the intro or the scroll */
  const h = Math.max(p, intro * INTRO_END)

  /* group positions, interpolated across the reference's four frames */
  const m1 = ramp(p, P.move1)
  const m2 = ramp(p, P.move2)
  const yHero = lerp(L.G.hero.start, L.G.hero.end, m1)
  const yServices = lerp(lerp(L.G.services.enter, L.G.services.mid, m1), L.G.services.end, m2)
  const yAbout = lerp(lerp(L.G.about.enter, L.G.about.mid, m1), L.G.about.end, m2)

  /* backdrops: each photo pushes in slowly over its own stretch of the scroll */
  const layers = [
    { src: BACKDROPS[0], o: 1, k: ramp(p, [0, 0.55]) },
    { src: BACKDROPS[1], o: ramp(p, P.bg2), k: ramp(p, [0.35, 0.85]) },
    { src: BACKDROPS[2], o: ramp(p, P.bg3), k: ramp(p, [0.7, 1]) },
  ]

  const goTo = (target: number) => (e: MouseEvent) => {
    e.preventDefault()
    const el = wrap.current
    if (!el) return
    window.scrollTo({
      top: el.offsetTop + target * (el.offsetHeight - window.innerHeight),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  return (
    <>
      <div ref={wrap} id="top" style={{ height: `${SCROLL_VH}vh`, background: INK }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: fit.mobile ? '100svh' : `max(calc(100vw * ${DESKTOP.H} / ${DESKTOP.W}), 100vh)`,
            overflow: 'hidden',
          }}
        >
          {layers.map((l) => (
            <img
              key={l.src}
              src={photo(l.src)}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: l.o,
                filter: 'brightness(0.72) saturate(1.05)',
                transform: reduce ? undefined : `scale(${1.12 - 0.12 * l.k})`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
          {/* a low purple wash ties the photos to the brand */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(70% 60% at 85% 15%, rgba(109,63,179,0.28) 0%, rgba(109,63,179,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* ---- navbar: viewport-level, natural size, outside the artboard ---- */}
          <nav className="navbar" aria-label="Main">
            <a href="#top" onClick={goTo(0)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <Logo />
              <span className="display" style={{ fontSize: 17, fontVariationSettings: '"wdth" 125, "wght" 700' }}>
                Precision Events
              </span>
            </a>
            <div className="nav-links">
              {NAV.map((n) => (
                <a key={n.t} href="#top" onClick={goTo(n.at)} className="label navlink">
                  {n.t}
                </a>
              ))}
              <a href="#gallery" className="label navlink">Gallery</a>
            </div>
            <a href={PHONE.tel} className="label navlink" style={{ color: '#fff' }}>
              Call us
            </a>
          </nav>

          {/* section scrims, viewport-wide */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: fit.mobile
                ? 'linear-gradient(180deg, rgba(13,11,18,0.55) 0%, rgba(13,11,18,0.82) 40%, rgba(13,11,18,0.9) 100%)'
                : 'linear-gradient(90deg, rgba(13,11,18,0.9) 0%, rgba(13,11,18,0.6) 34%, rgba(13,11,18,0) 62%)',
              opacity: 1 - m1,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(70% 60% at 50% 70%, rgba(13,11,18,0.88) 0%, rgba(13,11,18,0.45) 58%, rgba(13,11,18,0.15) 100%)',
              opacity: m1 * (1 - m2),
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(13,11,18,0) 30%, rgba(13,11,18,0.82) 66%, rgba(13,11,18,0.92) 100%)',
              opacity: m2,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          <main
            style={{
              position: 'absolute',
              left: px(fit.x),
              top: 0,
              width: px(L.W),
              height: px(L.H),
              transform: `scale(${fit.scale})`,
              transformOrigin: 'top left',
              zIndex: 2,
            }}
          >
            {/* ---- index rail ---- */}
            {!fit.mobile && (
              <div style={box(L.W - L.SAFE - 53, 451, 53, 272)} aria-hidden="true">
                {['01', '02', '03', '04', '05'].map((n, i) => (
                  <div
                    key={n}
                    className="label"
                    style={{
                      position: 'absolute',
                      top: px(i * 64),
                      right: 0,
                      fontSize: px(16),
                      color: i === Math.min(4, Math.floor(p * 5)) ? ACCENT : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}

            {/* ================= the hero ================= */}
            <section aria-label="Welcome" style={{ ...box(L.SAFE, 0, GW, 700), transform: `translateY(${yHero}px)`, willChange: 'transform' }}>
              <h1 style={{ margin: 0 }}>
                {HERO.words.map((w, i) => (
                  <Mask
                    key={w}
                    t={span(h, P.words[i])}
                    style={{ position: 'absolute', left: 0, top: px(L.hero.wordTops[i]), width: px(GW), height: px(L.hero.wordBox) }}
                  >
                    <span className="display" style={{ display: 'block', fontSize: px(L.hero.wordSize), lineHeight: px(L.hero.wordLh) }}>
                      {w}
                    </span>
                  </Mask>
                ))}
              </h1>

              <p style={{ margin: 0 }}>
                {lines.map((line, i) => (
                  <Mask
                    key={line}
                    t={span(h, bodyWindow(i))}
                    style={{ position: 'absolute', left: 0, top: px(L.hero.bodyTop + i * L.hero.bodyStep), width: px(GW), height: px(L.hero.bodyStep + 6) }}
                  >
                    <span style={{ fontSize: px(L.hero.bodySize), lineHeight: px(L.hero.bodyLh), color: 'rgba(255,255,255,0.84)' }}>{line}</span>
                  </Mask>
                ))}
              </p>

              {/* the two buttons */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: px(L.hero.buttonsTop),
                  opacity: span(h, bodyWindow(lines.length - 1)),
                  display: 'flex',
                  gap: px(14),
                }}
              >
                <a href={quoteLink('catering')} target="_blank" rel="noopener" className="label btn btn-solid">
                  Get a quote
                </a>
                <a href={PHONE.tel} className="label btn btn-ghost">
                  Call us
                  <span className="btn-dot">
                    <Arrow size={10} />
                  </span>
                </a>
              </div>

              {/* the bookings card — the reference's telemetry card, carrying the
                  phone number as its figure and three readouts under a rule */}
              <div
                style={{
                  position: 'absolute',
                  left: px(L.hero.card.x),
                  top: px(L.hero.card.y),
                  transform: `scale(${L.hero.card.scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  className="glass"
                  style={{
                    position: 'relative',
                    width: px(459),
                    height: px(289),
                    borderRadius: px(60),
                    opacity: span(h, P.stat),
                    transform: `translateY(${(1 - span(h, P.stat)) * 28}px)`,
                  }}
                >
                  <div style={{ position: 'absolute', inset: `${px(36)} ${px(40)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: px(17), lineHeight: px(23), color: 'rgba(255,255,255,0.88)' }}>
                        Bookings
                        <br />
                        &amp; quotes
                      </div>
                      <span className="label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
                        Cape Town
                      </span>
                    </div>

                    <a
                      href={PHONE.tel}
                      className="display"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: px(70),
                        fontSize: px(38),
                        lineHeight: px(44),
                        fontVariationSettings: '"wdth" 112, "wght" 300',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                      }}
                    >
                      {PHONE.display}
                    </a>
                    <div
                      className="label"
                      style={{ position: 'absolute', left: 0, top: px(124), fontSize: px(10), color: 'rgba(255,255,255,0.55)' }}
                    >
                      Call or WhatsApp · Elsies River
                    </div>

                    <div style={{ position: 'absolute', left: 0, right: 0, top: px(150), height: 1, background: 'rgba(255,255,255,0.14)' }} />

                    <div style={{ position: 'absolute', left: 0, right: 0, top: px(170), display: 'flex' }}>
                      {HERO.facts.map(([k, v], i) => (
                        <div
                          key={k}
                          style={{
                            flex: 1,
                            paddingLeft: i ? px(18) : 0,
                            borderLeft: i ? '1px solid rgba(255,255,255,0.14)' : undefined,
                          }}
                        >
                          <div className="display" style={{ fontSize: px(17), fontVariationSettings: '"wdth" 118, "wght" 600' }}>
                            {k}
                          </div>
                          <div className="label" style={{ marginTop: px(8), fontSize: px(9.5), color: 'rgba(255,255,255,0.6)' }}>
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= services ================= */}
            <section
              id="services"
              aria-labelledby="services-title"
              style={{ ...box(L.SAFE, 0, GW, 640), transform: `translateY(${yServices}px)`, willChange: 'transform' }}
            >
              {SERVICES.cards.map((c, i) => {
                const t = span(p, [P.g54In[0] + i * 0.004, P.g54In[1]])
                return (
                  <a
                    key={c.art + i}
                    href={quoteLink(c.quote)}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${c.label.join(' ')}: ask for a quote on WhatsApp`}
                    className="service-card"
                    style={{
                      position: 'absolute',
                      left: px(L.cards.pos[i].x),
                      top: px(L.cards.pos[i].y),
                      width: px(255),
                      height: px(215),
                      opacity: t,
                      transform: `scale(${L.cards.scale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, borderRadius: px(46), overflow: 'hidden' }}>
                      <img
                        src={photo(c.art)}
                        alt={c.alt}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* the label sits on a photo, so it gets its own ground */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(150deg, rgba(13,11,18,0.85) 0%, rgba(13,11,18,0.35) 52%, rgba(13,11,18,0.08) 100%)',
                        }}
                      />
                    </div>
                    <div
                      style={{ position: 'absolute', inset: 0, borderRadius: px(46), border: '1px solid rgba(255,255,255,0.28)', pointerEvents: 'none' }}
                    />
                    <div
                      className="display"
                      style={{
                        position: 'absolute',
                        left: px(22),
                        top: px(30),
                        fontSize: px(19),
                        lineHeight: px(23),
                        fontVariationSettings: '"wdth" 125, "wght" 600',
                      }}
                    >
                      {c.label[0]}
                      <br />
                      {c.label[1]}
                    </div>
                    <div className="card-dot">
                      <Arrow size={14} />
                    </div>
                  </a>
                )
              })}

              <h2
                id="services-title"
                className="display"
                style={{ position: 'absolute', left: 0, width: px(GW), margin: 0, top: px(L.services.titleTop), fontSize: px(L.services.titleSize), textAlign: 'center' }}
              >
                {SERVICES.title}
              </h2>
              <p
                style={{
                  position: 'absolute',
                  left: px((GW - L.services.bodyW) / 2),
                  top: px(L.services.bodyTop),
                  width: px(L.services.bodyW),
                  margin: 0,
                  fontSize: px(L.services.bodySize),
                  lineHeight: px(L.services.bodyLh),
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                {SERVICES.body}
              </p>
            </section>

            {/* ================= about the family ================= */}
            <section
              id="about"
              aria-labelledby="about-title"
              style={{ ...box(L.SAFE, 0, GW, 810), transform: `translateY(${yAbout}px)`, willChange: 'transform' }}
            >
              <div style={{ position: 'absolute', left: 0, top: px(L.about.ruleTop), width: px(56), height: px(2), background: ACCENT }} />
              <h2
                id="about-title"
                className="display"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: px(L.about.headTop),
                  width: px(L.about.headW),
                  margin: 0,
                  fontSize: px(L.about.headSize),
                  lineHeight: px(L.about.headLh),
                }}
              >
                {ABOUT.title}
              </h2>
              <p
                style={{
                  position: 'absolute',
                  left: px(L.about.bodyX),
                  top: px(L.about.bodyTop),
                  width: px(L.about.bodyW),
                  margin: 0,
                  fontSize: px(15.5),
                  lineHeight: px(26),
                  color: 'rgba(255,255,255,0.82)',
                }}
              >
                {ABOUT.body}
              </p>
            </section>
          </main>
        </div>
      </div>
      <Gallery />
      <Footer />
    </>
  )
}
