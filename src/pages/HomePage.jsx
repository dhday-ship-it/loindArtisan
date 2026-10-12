// 아티즌 홈 — 배포 파이프라인 연결 확인용 (화면 영향 없음)
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { fetchArtisanStories } from '../data.js'
import '../case-list.css'

function Footer() {
  return <footer><div className="footer-brand"><strong>LOIND</strong><small>© 2026 LOIND. All rights reserved.</small></div><div className="footer-links"><div><p>Company</p><a href="https://loind.com/about">About</a><a href="https://loind.com/service">Service</a><a href="https://loind.com/story">Story</a><a href="https://loind.com/contact">Contact</a><a href="https://www.loindworks.com">Works</a></div><div><p>Resources</p><a href="https://loind.com/story">Story</a><a href="https://www.instagram.com/loind_official/">Instagram</a><a href="https://youtube.com/@loind-youtube">Youtube</a></div></div></footer>
}

// 포트폴리오 섹션은 로인드 홈페이지(loind-web) 스토리 중 "아티즌" 카테고리로 올라온
// 실제 작업 사례만 보여준다 — 의뢰 타입 카탈로그(촬영/명함 등)는 여기 섞지 않는다.
const STORY_SITE_BASE = 'https://loind.com'

const WORKS_PER_PAGE = 12 // 3열 × 4행

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuTab, setMenuTab] = useState('service')
  const [artisanStories, setArtisanStories] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    fetchArtisanStories().then((stories) => {
      if (!cancelled) setArtisanStories(stories)
    })
    return () => { cancelled = true }
  }, [])

  // 플로팅 배지의 원형 텍스트를 스크롤량에 따라 회전시킨다.
  useEffect(() => {
    const ring = document.querySelector('.order-fab-ring')
    if (!ring) return
    let raf = 0
    const getScroll = () =>
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    const update = () => {
      ring.style.setProperty('--rot', `${getScroll() * 0.4}deg`)
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    // 페이지가 window가 아니라 내부 요소에서 스크롤될 수도 있어 양쪽 모두 구독한다.
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    update()

    // 푸터가 화면에 보이면 플로팅 배지를 숨긴다.
    const fab = document.querySelector('.order-fab')
    const footer = document.querySelector('footer')
    let observer
    if (fab && footer) {
      observer = new IntersectionObserver(
        ([entry]) => fab.classList.toggle('is-hidden', entry.isIntersecting),
        { rootMargin: '0px 0px -10% 0px' },
      )
      observer.observe(footer)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll, { capture: true })
      if (raf) cancelAnimationFrame(raf)
      if (observer) observer.disconnect()
    }
  }, [])

  return <div className="site-shell" id="top">
    <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} menuTab={menuTab} onMenuTabChange={setMenuTab} />
    <main>
      <section className="hero"><div className="hero-copy"><p className="pledged" role="button" tabIndex={0} onClick={() => { setMenuTab('pledged'); setMenuOpen(true) }} onKeyDown={(e) => { if (e.key === 'Enter') { setMenuTab('pledged'); setMenuOpen(true) } }}>* LOIND PLEDGED 적용받는 브랜드입니다.</p><p className="eyebrow">Spirit-Inspired Artisans</p><h1>우리는 각자의 달란트로<br />함께의 길을 걷는 자들입니다.</h1><Link className="dark-button hero-cta" to="/category/custom">의뢰하기 <b>↗</b></Link></div><div className="hero-image"><div className="hero-visual"><div className="visual-wave visual-wave--one" /><div className="visual-wave visual-wave--two" /><div className="visual-glass visual-glass--back" /><div className="visual-glass visual-glass--front"><small>ARTISAN / 001</small><strong>Gifts<br />made visible.</strong><span>↗</span></div><div className="visual-chip visual-chip--top">LOIND <i>CREATOR GROUND</i></div><div className="visual-chip visual-chip--bottom">Scroll to explore <b>↓</b></div></div></div></section>
      <section className="works" id="artisans">
        <div className="section-title">
          <div><p className="eyebrow">Artisan Works</p><h2>이런 작업들을 해왔어요</h2></div>
        </div>

        {artisanStories.length > 0 ? (() => {
          const totalPages = Math.ceil(artisanStories.length / WORKS_PER_PAGE)
          const start = (page - 1) * WORKS_PER_PAGE
          const pageItems = artisanStories.slice(start, start + WORKS_PER_PAGE)
          return <>
            <div className="story-grid">
              {pageItems.map((s) => (
                <a
                  key={s.id}
                  href={`${STORY_SITE_BASE}/story/${s.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="story-card"
                >
                  <div className="story-card-media">
                    <img src={s.img} alt={s.title} loading="lazy" />
                  </div>
                  <div className="story-card-body">
                    <p className="story-card-eyebrow">아티즌 스토리</p>
                    <h3>{s.title}</h3>
                    <p className="story-card-desc">{s.summary || s.text}</p>
                  </div>
                </a>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="포트폴리오 페이지">
                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="이전 페이지"
                >←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={n === page ? 'pagination-num active' : 'pagination-num'}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}
                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="다음 페이지"
                >→</button>
              </nav>
            )}
          </>
        })() : (
          <div className="case-empty">
            <p>아직 소개된 작업 사례가 없어요.</p>
            <span>곧 다양한 아티즌 작업 사례를 만나보실 수 있어요.</span>
          </div>
        )}
      </section>
    </main>
    <a href="https://pf.kakao.com/_iIxbxnX" target="_blank" rel="noreferrer" className="order-fab" aria-label="아티즌 문의하기">
      <svg className="order-fab-ring" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="fabTextCircle" d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0" />
        </defs>
        <text>
          <textPath href="#fabTextCircle" startOffset="0" textLength="207" lengthAdjust="spacing">아티즌 문의하기 · 아티즌 문의하기 · </textPath>
        </text>
      </svg>
      <span className="order-fab-icon" aria-hidden="true">✎</span>
    </a>
    <Footer />
  </div>
}
