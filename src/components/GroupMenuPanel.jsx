import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { artisanCategories, riseRows } from './groupMenuData.js'

export function GroupMenuPanel({ onClose, initialTab = 'service' }) {
  const [menuTab, setMenuTab] = useState(initialTab)
  return <>
    <div className={styles.menuBackdrop} onClick={onClose} />
    <div className={`${styles.menuPanel} shared-group-menu`}>
      <div className={`container ${styles.menuPanelInner} shared-group-menu__inner`}>
        <div className={styles.menuSideCol}>
          <button type="button" className={`${styles.menuTabCard} ${menuTab === 'service' ? styles.menuTabActive : ''}`} onClick={() => setMenuTab('service')}><span className={styles.menuEyebrow}>SERVICE</span><span className={styles.menuCardTitle}>서비스 항목</span></button>
          <div className={styles.menuSideDivider} />
          <button type="button" className={`${styles.menuTabCard} ${menuTab === 'intro' ? styles.menuTabActive : ''}`} onClick={() => setMenuTab('intro')}><span className={styles.menuEyebrow}>ABOUT</span><span className={styles.menuCardTitle}>그룹 소개</span></button>
          <button type="button" className={`${styles.menuTabCard} ${menuTab === 'pledged' ? styles.menuTabActive : ''}`} onClick={() => setMenuTab('pledged')}><span className={styles.menuEyebrow}>LOIND</span><span className={styles.menuCardTitle}>PLEDGED</span></button>
        </div>
        <div className={styles.menuMainCol}>
          {menuTab === 'intro' && <section className={styles.menuPanelBlock}><h4 className={styles.menuBlockTitle}>그룹 소개</h4><p className={styles.menuIntroText}>로인드는 크리에이티브 에이전시, 크리에이티브 스튜디오, 크리스천 브랜드 등 여러 브랜드를 통해 크리스천 정체성을 담은 사업을 전개하고 있습니다.</p><a href="https://loind.com/about" className={styles.menuGoLink} onClick={onClose}>그룹 소개 페이지 보기 →</a></section>}
          {menuTab === 'pledged' && <section className={styles.menuPanelBlock}><h4 className={styles.menuBlockTitle}>LOIND PLEDGED</h4><p className={styles.menuIntroText}>준비 중입니다.</p></section>}
          {menuTab === 'service' && <><section className={styles.menuPanelBlock}><h4 className={styles.menuBlockTitle}>일반비즈니스</h4><div className={styles.menuGroupGrid}>{[{ name: 'Creative Agency', items: ['영상프로덕션', '디자인', 'IT-개발 에이전시', '이벤트'] }, { name: 'Studio LODN', items: ['음악', '영상', 'IP 비즈니스'] }].map((row) => <div key={row.name} className={`${styles.menuHRow} ${styles.menuCat}`}><div className={styles.menuHRowTitle}><span className={styles.menuPill}>{row.name}</span></div><div className={styles.menuInline}>{row.items.map((item) => <p key={item} className={styles.menuColItem}>{item}</p>)}</div></div>)}</div></section><section className={styles.menuPanelBlock}><h4 className={styles.menuBlockTitle}>크리스천비즈니스</h4><a href="/" className={styles.menuSubBar} onClick={onClose}><span className={styles.menuSubBarName}>아티즌, 기독교 아웃소싱(외주)</span><span className={styles.menuSubBarGo}>페이지 바로가기 →</span></a><div className={styles.menuCatGrid}>{artisanCategories.map((cat) => <Link key={cat.title} to={`/category/${cat.slug}`} onClick={onClose} className={`${styles.menuCat} ${styles.menuCatLink}`}><p className={styles.menuColTitle}>{cat.title}</p><p className={styles.menuCatPreview}>{cat.items.length > 0 ? cat.items.join(' · ') : cat.blurb}</p><span className={styles.menuCatCta}>바로 의뢰하기 →</span></Link>)}</div><div className={styles.menuSubDivider} /><a href="https://loind.com/rise" className={styles.menuSubBar} onClick={onClose}><span className={styles.menuSubBarName}>라이즈, 크리스천 사역 인큐베이팅</span><span className={styles.menuSubBarGo}>페이지 바로가기 →</span></a><div className={styles.menuRiseGrid}>{riseRows.map((row) => <div key={row.name} className={styles.menuCat}><p className={styles.menuColTitle}>{row.name}</p><div className={styles.menuInline}>{row.items.map((item) => <p key={item} className={styles.menuColItem}>{item}</p>)}</div></div>)}</div></section></>}
        </div>
      </div>
    </div>
  </>
}
