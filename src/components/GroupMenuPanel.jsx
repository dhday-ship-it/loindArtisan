import { useState } from 'react'
import styles from './Header.module.css'

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
          {menuTab === 'intro' && <section className={styles.menuPanelBlock}><h4 className={styles.menuBlockTitle}>그룹 소개</h4><p className={styles.menuIntroText}>로인드는 크리에이티브 에이전시 아티즌, 크리에이티브 스튜디오 로든, 크리스천 브랜드 라이즈 등 여러 브랜드를 통해 크리스천 정체성을 담은 사업을 전개하고 있습니다.</p><a href="https://loind.com/about" className={styles.menuGoLink} onClick={onClose}>그룹 소개 페이지 보기 →</a></section>}
          {menuTab === 'pledged' && <section className={styles.menuPanelBlock}><h4 className={styles.menuBlockTitle}>LOIND PLEDGED</h4><p className={styles.menuIntroText}>준비 중입니다.</p></section>}
          {menuTab === 'service' && <section className={styles.menuPanelBlock}>
            <div className={styles.menuGroupGrid}>
              {[
                { name: '제작 스튜디오 : 아티즌', items: ['영상 프로덕션', '디자인', 'IT개발(앱,웹)', '온라인·오프라인 세미나'], to: 'https://artisan.loind.com' },
                { name: '브랜드 콘텐츠 : 로든', items: ['음악', '영상', 'IP 비즈니스'] },
                { name: '크리스천 비즈니스 : 라이즈', items: ['아웃소싱(외주)', '사역 인큐베이팅'] },
              ].map((row) => (
                <div key={row.name} className={`${styles.menuHRow} ${styles.menuCat}`}>
                  <div className={styles.menuHRowTitle}><span className={styles.menuPill}>{row.name}</span></div>
                  <div className={styles.menuInline}>{row.items.map((item) => <p key={item} className={styles.menuColItem}>{item}</p>)}</div>
                  {row.to && (
                    <a href={row.to} target="_blank" rel="noreferrer" className={styles.menuHRowGo} onClick={onClose}>페이지 바로가기 →</a>
                  )}
                </div>
              ))}
            </div>
          </section>}
        </div>
      </div>
    </div>
  </>
}
