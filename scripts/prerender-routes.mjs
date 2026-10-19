// 빌드 후 실행: 카테고리 페이지마다 dist/category/<slug>.html 을 만들어 페이지별 제목·설명·canonical 을 넣는다.
// (vercel.json 의 rewrite 로 /category/video 요청에 category/video.html 이 나감. 화면은 그대로 React 가 그린다)
// 모든 주소가 index.html 로 가면 검색 로봇에게 카테고리 페이지가 전부 같은 제목으로 보이기 때문.
// ※ 카테고리를 추가하면 아래 PAGES 와 public/sitemap.xml 에 함께 추가해주세요.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://artisan.loind.com'
const PAGES = [
  { slug: 'video', title: '영상 프로덕션', desc: '홍보영상·스케치영상·강의영상·인터뷰영상 — 기획부터 촬영·편집까지 로인드 아티즌이 함께 만듭니다.' },
  { slug: 'design', title: '디자인', desc: '디자인부터 인쇄·제작·배송까지, 로인드 아티즌이 한 번에 진행합니다.' },
  { slug: 'web', title: '홈페이지 · 웹', desc: '브랜드에 맞춘 홈페이지와 웹 서비스를 기획하고 개발합니다.' },
  { slug: 'photo', title: '사진 촬영', desc: '행사와 현장의 순간을 로인드 아티즌이 사진으로 담습니다.' },
  { slug: 'goods', title: '굿즈 · 기념품 제작', desc: '단체 굿즈와 기념품을 디자인부터 제작까지 함께합니다.' },
  { slug: 'custom', title: '커스텀작업 신청', desc: '원하는 작업을 자유롭게 의뢰하세요. 영상·디자인·웹·사진·굿즈까지 로인드 아티즌이 함께 만듭니다.' },
]

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
function replaceOnce(html, pattern, value, label) {
  if (!pattern.test(html)) throw new Error(`index.html 에서 ${label} 을(를) 찾지 못했습니다`)
  return html.replace(pattern, value)
}

const base = readFileSync('dist/index.html', 'utf8')
mkdirSync('dist/category', { recursive: true })
for (const p of PAGES) {
  const url = `${SITE}/category/${p.slug}`
  const title = escape(`${p.title} · 로인드 아티즌 | LOIND ARTISAN`)
  const desc = escape(p.desc)
  let html = base
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, 'title')
  html = replaceOnce(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${desc}" />`, 'description')
  html = replaceOnce(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`, 'og:title')
  html = replaceOnce(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${desc}" />`, 'og:description')
  html = replaceOnce(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  html = replaceOnce(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, 'canonical')
  // 로봇용 요약: 제목·설명 + 다른 카테고리 링크는 index.html 의 nav 를 그대로 둔다
  html = replaceOnce(html, /<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>/, `<h1>${escape(p.title)} — 로인드 아티즌 LOIND ARTISAN</h1>\n      <p>${desc}</p>`, 'noscript 요약')
  writeFileSync(`dist/category/${p.slug}.html`, html)
  console.log(`prerender: dist/category/${p.slug}.html`)
}
