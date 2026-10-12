import { Link } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import '../work.css'
import '../auth/auth-pages.css'

// 로그인·회원가입 자리에 임시로 띄우는 안내 화면.
// LOIND 그룹 통합 멤버십 설계가 끝나면 이 화면을 실제 로그인/가입 흐름으로 교체한다.
// (인증 인프라 AuthContext는 그대로 보존 중)
export function MembershipPendingPage() {
  return <div className="site-shell" id="top">
    <Header />
    <main>
      <div className="auth-page">
        <div className="auth-card auth-card--notice">
          <span className="auth-notice-badge">준비중</span>
          <h1>통합 멤버십을 준비하고 있어요</h1>
          <p className="auth-sub">
            LOIND 그룹 서비스를 하나의 계정으로 이용하실 수 있는 통합 멤버십을 준비하고 있어요.
            조금만 기다려 주세요.
          </p>
          <p className="auth-sub auth-sub--muted">
            지금은 로그인 없이도 의뢰하실 수 있어요. 아래에서 바로 작업을 신청해 보세요.
          </p>
          <div className="auth-notice-actions">
            <Link to="/category/custom" className="order-form-submit auth-notice-primary">작업 의뢰하러 가기</Link>
            <Link to="/" className="auth-switch-link">홈으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </main>
  </div>
}
