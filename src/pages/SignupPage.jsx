import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import '../work.css'
import '../auth/auth-pages.css'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [churchName, setChurchName] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!churchName || !name || !phone || !email) {
      setError('소속, 이름, 연락처, 이메일은 필수예요.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 해요.')
      return
    }
    setSubmitting(true)
    try {
      await signup({ email, password, name, phone, churchName })
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
          <h1>회원가입</h1>
          <p className="auth-sub">가입하시면 의뢰 내역을 한눈에 확인하실 수 있어요.</p>
          <form className="order-form" onSubmit={submit}>
            <label>
              <span>소속 *</span>
              <input value={churchName} onChange={(e) => setChurchName(e.target.value)} placeholder="예: OO교회, OO단체, 개인" />
            </label>
            <label>
              <span>이름 / 담당자명 *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
            </label>
            <label>
              <span>연락처 *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
            </label>
            <label>
              <span>이메일 *</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            <label>
              <span>비밀번호 *</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자 이상" />
            </label>
            {error && <p className="order-form-error">{error}</p>}
            <button type="submit" disabled={submitting} className="order-form-submit">
              {submitting ? '가입 중...' : '회원가입'}
            </button>
          </form>
          <p className="auth-switch">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
      </div>
    </main>
  </div>
}
