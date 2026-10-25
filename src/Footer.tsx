/*
  Footer, structured after the reference: a CTA band across the top with the
  contact actions on the right (in place of the newsletter), a rule, the brand
  column beside three link columns, a legal bar, and the oversized wordmark
  fading out at the bottom.
*/
import Logo from './Logo'
import { ACCENT, ADDRESS, FACEBOOK, INK_DEEP, PHONE, SERVICES, quoteLink } from './content'

const COLUMNS = [
  { head: 'Services', links: SERVICES.cards.map((c) => ({ t: c.label.join(' '), href: quoteLink(c.quote) })) },
  { head: 'Visit', links: ADDRESS.map((t) => ({ t, href: undefined })) },
  {
    head: 'Connect',
    links: [
      { t: PHONE.display, href: PHONE.tel },
      { t: 'WhatsApp', href: PHONE.whatsapp },
      { t: 'Facebook', href: FACEBOOK },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: INK_DEEP, padding: '0 16px', position: 'relative', zIndex: 1 }}>
      <div className="footer-panel">
        {/* ---- CTA band ---- */}
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 420px' }}>
            <span className="pill label">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
              Let's talk food
            </span>
            <h2 className="display" style={{ margin: '20px 0 0', fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.08 }}>
              Planning a function?{' '}
              <span style={{ fontStyle: 'italic', fontVariationSettings: '"wdth" 125, "wght" 400', color: 'rgba(255,255,255,0.72)' }}>
                We'll feed them.
              </span>
            </h2>
            <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: '24px', color: 'rgba(255,255,255,0.68)', maxWidth: 440 }}>
              Tell us the date, the number of guests and what you have in mind. We'll put together a menu and a price that works.
            </p>
          </div>

          <div style={{ flex: '0 1 380px' }}>
            <div className="label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
              Bookings &amp; quotes
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href={PHONE.tel} className="footer-btn footer-btn-solid">
                Call {PHONE.display}
              </a>
              <a href={quoteLink('catering')} target="_blank" rel="noopener" className="footer-btn footer-btn-ghost">
                WhatsApp us
              </a>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              Prices are negotiable. Ask us about your budget.
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.10)', margin: '44px 0 40px' }} />

        {/* ---- brand + link columns ---- */}
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Logo />
              <span className="display" style={{ fontSize: 17, fontVariationSettings: '"wdth" 125, "wght" 700' }}>
                Precision Events
              </span>
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 14, lineHeight: '22px', color: 'rgba(255,255,255,0.6)', maxWidth: 280 }}>
              Family-run catering for celebrations and functions across Cape Town.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.head} style={{ flex: '0 1 170px' }}>
              <div className="label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
                {col.head}
              </div>
              {col.links.map((l) =>
                l.href ? (
                  <a
                    key={l.t}
                    href={l.href}
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : null)}
                    className="footer-link"
                  >
                    {l.t}
                  </a>
                ) : (
                  <div key={l.t} style={{ fontSize: 14, lineHeight: '30px', color: 'rgba(255,255,255,0.8)' }}>
                    {l.t}
                  </div>
                ),
              )}
            </div>
          ))}
        </div>

        {/* ---- legal bar ---- */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            marginTop: 40,
            padding: '20px 0 28px',
          }}
        >
          <span>&#169; 2026 Precision Events. All rights reserved.</span>
          <span>Elsies River, Cape Town</span>
          <a href="#top" className="footer-link" style={{ lineHeight: 'inherit', fontSize: 13 }}>
            Back to top
          </a>
        </div>

        {/* ---- the wordmark, fading into the panel ---- */}
        <div
          className="display"
          aria-hidden="true"
          style={{
            fontSize: 'clamp(40px, 11vw, 170px)',
            lineHeight: 1.04,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.03) 82%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            userSelect: 'none',
            marginBottom: 4,
          }}
        >
          Precision
        </div>
      </div>
      <div style={{ height: 16 }} />
    </footer>
  )
}
