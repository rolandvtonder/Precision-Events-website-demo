import { ACCENT, FACEBOOK, GALLERY, INK, photo } from './content'

/*
  Gallery. Ordinary flow after the scroll stage, like the footer — a mosaic
  with the team photo as the large tile, two columns on phones.
*/
export default function Gallery() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" style={{ background: INK, padding: '96px 24px 80px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1312, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <span className="pill label">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
              Gallery
            </span>
            <h2 id="gallery-title" className="display" style={{ margin: '20px 0 0', fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1 }}>
              From our kitchen
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: '24px', color: 'rgba(255,255,255,0.7)' }}>
            Real food from real functions, cooked and served by our own team.{' '}
            <a href={FACEBOOK} target="_blank" rel="noopener" className="inline-link">
              See more on Facebook
            </a>
          </p>
        </div>

        <div className="gallery-grid">
          {GALLERY.map((g, i) => (
            <figure key={g.src} className={i === 0 ? 'g-big' : undefined}>
              <img src={photo(g.src)} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
