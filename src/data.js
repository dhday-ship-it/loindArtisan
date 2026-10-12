import iconRequest from './assets/icons/request.png'
import iconDesign from './assets/icons/design.png'
import iconVideo from './assets/icons/video.png'
import iconWeb from './assets/icons/web.png'
import iconGift from './assets/icons/gift.png'
import iconPhoto from './assets/icons/photo.svg'

// 상단 카테고리 원형 네비게이션. slug는 카테고리 페이지 경로(/category/:slug)와 매칭된다.
// label은 백엔드 카테고리명과 글자 단위로 일치해야 하는 '매칭 키'이므로 바꾸지 말 것.
// 화면에 다르게 보여주고 싶을 때만 displayLabel을 쓴다 (없으면 label을 그대로 노출).
export const categories = [
  { slug: 'custom', label: '커스텀작업 신청', icon: iconRequest },
  { slug: 'video', label: '영상', icon: iconVideo },
  { slug: 'web', label: '홈페이지,웹', icon: iconWeb },
  { slug: 'design', label: '디자인', note: '인쇄·제작·배송까지', icon: iconDesign },
  { slug: 'photo', label: '사진 촬영', icon: iconPhoto },
  { slug: 'goods', label: '굿즈,기념품 제작', icon: iconGift },
]

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]))

// 디자인 품목이 많아(12개) 화면에서 그룹으로 묶어 보여준다. (데이터/가격은 그대로 두고 UI만 그룹핑)
// 각 그룹의 keywords로 실제 품목(work.title)을 부분 매칭한다 — 백엔드 품목명이 조금 바뀌어도 흡수.
export const DESIGN_GROUPS = [
  { id: 'print', label: '인쇄물·간행물', desc: '주보·헌금봉투·소식지·말씀카드', keywords: ['주보', '헌금봉투', '소식지', '뉴스레터', '말씀카드'] },
  { id: 'banner', label: '현수막·배너', desc: '현수막·배너·행사 포스터', keywords: ['현수막', '배너', '포스터'] },
  { id: 'card', label: '명함·초청장', desc: '명함·초청장', keywords: ['명함', '초청장'] },
  { id: 'online', label: '온라인·SNS', desc: 'SNS 카드뉴스·썸네일', keywords: ['SNS', '카드뉴스', '썸네일'] },
  { id: 'brand', label: '로고·브랜딩', desc: '로고 디자인', keywords: ['로고'] },
]

// 품목 하나가 어느 그룹에 속하는지 (못 찾으면 null)
export function findDesignGroup(title) {
  return DESIGN_GROUPS.find((g) => g.keywords.some((k) => title.includes(k)))?.id ?? null
}

// 카테고리별 진행 단계 안내. 의뢰 스테이션 상단에 표시된다.
export const CATEGORY_PROCESS_STEPS = {
  '디자인': ['의뢰', '검토', '초안제작', '담당자확인', '제작', '납품'],
  '영상': ['의뢰', '검토', '소통', '실행', '납품'],
  '사진 촬영': ['의뢰', '검토', '소통', '실행', '납품'],
  '홈페이지,웹': ['의뢰', '검토', '소통', '제작', '납품'],
  '굿즈,기념품 제작': ['의뢰', '검토', '소통', '제작', '납품'],
}

export const API_BASE = import.meta.env.VITE_WORKSPACE_API_URL ?? ''

// 아티즌 홈 포트폴리오는 로인드 홈페이지(loind-web)의 Supabase stories 테이블에서
// "Artisan" 카테고리 글을 직접 읽어온다. loind-web이 공개(anon) 키로 브라우저에서
// 직접 읽는 테이블이라, 중계 서버 없이 여기서도 같은 방식(REST, 읽기 전용)으로 조회한다.
const LOIND_WEB_SUPABASE_URL = import.meta.env.VITE_LOIND_WEB_SUPABASE_URL ?? ''
const LOIND_WEB_SUPABASE_ANON_KEY = import.meta.env.VITE_LOIND_WEB_SUPABASE_ANON_KEY ?? ''

export async function fetchArtisanStories() {
  if (!LOIND_WEB_SUPABASE_URL || !LOIND_WEB_SUPABASE_ANON_KEY) return []
  const query = new URLSearchParams({
    category: 'eq.Artisan',
    order: 'created_at.desc',
    select: 'id,title,text,summary,img,images,link,created_at',
  })
  try {
    const res = await fetch(`${LOIND_WEB_SUPABASE_URL}/rest/v1/stories?${query}`, {
      headers: {
        apikey: LOIND_WEB_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${LOIND_WEB_SUPABASE_ANON_KEY}`,
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
