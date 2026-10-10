import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import '../work.css'
import '../auth/auth-pages.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/my')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="site-shell" id="top">
    <Header />
    <main>
      <div className="auth-page">
        <div className="auth-card">
          <h1>로그인</h1>
          <p className="auth-sub">내 의뢰 내역을 확인하려면 로그인해주세요.</p>
          <form className="order-form" onSubmit={submit}>
            <label>
              <span>이메일</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            <label>
              <span>비밀번호</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
            </label>
            {error && <p className="order-form-error">{error}</p>}
            <button type="submit" disabled={submitting} className="order-form-submit">
              {submitting ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <p className="auth-switch">아직 계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
        </div>
      </div>
    </main>
  </div>
}
