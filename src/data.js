import iconRequest from './assets/icons/request.png'
import iconDesign from './assets/icons/design.png'
import iconVideo from './assets/icons/video.png'
import iconWeb from './assets/icons/web.png'
import iconGift from './assets/icons/gift.png'
import iconPhoto from './assets/icons/photo.svg'

// 상단 카테고리 원형 네비게이션. slug는 카테고리 페이지 경로(/category/:slug)와 매칭된다.
export const categories = [
  { slug: 'custom', label: '커스텀작업 신청', icon: iconRequest },
  { slug: 'video', label: '영상', icon: iconVideo },
  { slug: 'web', label: '홈페이지,웹', icon: iconWeb },
  { slug: 'design', label: '디자인', icon: iconDesign },
  { slug: 'photo', label: '사진 촬영', icon: iconPhoto },
  { slug: 'goods', label: '굿즈,기념품 제작', icon: iconGift },
]

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]))

// 백엔드(로인드 웍스) 관리자 화면의 CATEGORY_OPTIONS와 반드시 동일하게 유지할 것 —
// 세부 분류 필터 값이 어긋나면 카테고리 페이지에서 아무것도 안 잡힌다.
export const CATEGORY_TAGS = {
  '커스텀작업 신청': [],
  '디자인': [
    '주보', '헌금봉투', '현수막(강단/외벽)', '배너·X배너·롤업배너', '수련회/행사 포스터',
    '초청장', '로고 디자인', '명함', '교회 소식지·뉴스레터', '말씀카드', 'SNS카드뉴스', '각종 썸네일',
  ],
  // 영상은 개별 항목이 아니라 촬영/편집/그래픽 3개 분야로만 나뉘고, 각 분야 상세 페이지에서
  // 예시를 보여준 뒤 분야 단위로 통합 신청을 받는다 (개별 항목별 가격/신청 없음).
  '영상': ['촬영', '편집', '그래픽'],
  // 사진 촬영도 타입 선택 없이 단일 항목으로 의뢰서를 바로 작성한다.
  '사진 촬영': [],
  '홈페이지,웹': ['(템플릿) 반응형 공식 웹페이지 + 관리자페이지', '(커스텀) 반응형 공식 웹페이지 + 관리자 페이지', '(기타 웹페이지)'],
  // 굿즈,기념품 제작도 타입 선택 없이 단일 항목으로 의뢰서를 바로 작성한다.
  '굿즈,기념품 제작': [],
}

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

// 백엔드에 게시물이 하나도 없을 때 홈 ONE-PICK 섹션에 쓰는 기본 목록.
export const FALLBACK_WORKS = [
  { category: '브랜딩', title: '브랜드의 시작을 함께 설계합니다', text: '정체성을 발견하고 오래 남는 언어와 모습을 만듭니다.', color: 'lavender', imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85', requests: 0 },
  { category: '홈페이지 / 웹', title: '반응형 공식 웹사이트', text: '복잡한 이야기를 명확하고 아름다운 경험으로 바꿉니다.', color: 'blue', imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=85', requests: 0 },
  { category: '디자인', title: '매일 쓰이는 인쇄물과 굿즈', text: '주보, 현수막, 기념품까지 목적에 맞는 디자인을 만듭니다.', color: 'mint', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85', requests: 0 },
  { category: '굿즈 / 기념품', title: '마음을 전하는 물성', text: '수련회 단체 티셔츠와 커스텀 굿즈를 제작합니다.', color: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85', requests: 0 },
  { category: '기타', title: '공간에 남는 사인과 현판', text: '공동체의 첫인상을 만드는 사인과 현판을 만듭니다.', color: 'lilac', imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85', requests: 0 },
]

export const API_BASE = import.meta.env.VITE_WORKSPACE_API_URL ?? ''
