import { COMPANY, PRIVACY_URL } from '../company.js'
import './footer.css'

// 사이트 공통 푸터 — 로인드 홈페이지(loind.com) 푸터와 같은 디자인·구성.
// 개인정보처리방침은 로인드 그룹 통합본(loind.com/privacy)으로 연결한다.
export function Footer() {
  return <footer className="lw-footer">
    <div className="lw-footer-container">
      <div className="lw-footer-left">
        <h2 className="lw-footer-logo">LOIND</h2>
        <div className="lw-footer-company">
          <p>
            {COMPANY.name} <span>|</span> 대표 {COMPANY.ceo}
            {COMPANY.bizNumber && <><span>|</span> 사업자등록번호 {COMPANY.bizNumber}</>}
          </p>
          <p>{COMPANY.address}</p>
          <p>
            {COMPANY.phone && <>전화 {COMPANY.phone} <span>|</span> </>}
            이메일 <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
          <p className="lw-footer-legal">
            <a href={PRIVACY_URL}>개인정보처리방침</a>
          </p>
        </div>
        <p className="lw-footer-copy">© 2026 LOIND. All rights reserved.</p>
      </div>
      <div className="lw-footer-right">
        <div className="lw-footer-links">
          <h4>Company</h4>
          <a href="https://loind.com/about">About</a>
          <a href="https://loind.com/service">Service</a>
          <a href="https://loind.com/story">Story</a>
          <a href="https://loind.com/contact">Contact</a>
          <a href="https://www.loindworks.com" target="_blank" rel="noopener noreferrer">Works</a>
        </div>
        <div className="lw-footer-links">
          <h4>Resources</h4>
          <a href="https://loind.com/story">Story</a>
          <a href="https://www.instagram.com/loind_official/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://youtube.com/@loind-youtube?si=X0Cy9L6flUmFkft9" target="_blank" rel="noopener noreferrer">Youtube</a>
        </div>
      </div>
    </div>
  </footer>
}
