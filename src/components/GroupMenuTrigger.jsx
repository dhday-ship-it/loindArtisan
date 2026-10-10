import styles from './Header.module.css'

export function GroupMenuTrigger({ open, onClick, label = '그룹사 메뉴 열기' }) {
  const activeLabel = open ? '메뉴 닫기' : label
  return <button type="button" className={styles.menuButton} aria-label={activeLabel} title={activeLabel} aria-expanded={open} onClick={onClick}>
    <span className={styles.menuIcon}><span className={`${styles.menuBar} ${open ? styles.menuBarOpen : ''}`} /></span>
  </button>
}
