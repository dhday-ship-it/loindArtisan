import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { MembershipPendingPage } from './pages/MembershipPendingPage.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import './App.css'
import './top.css'
import './premium-top.css'

function App() {
  return <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/category/:slug/:workId" element={<CategoryPage />} />
      {/* 통합 멤버십 준비 전까지 로그인/회원가입은 안내 화면으로 대체 */}
      <Route path="/login" element={<MembershipPendingPage />} />
      <Route path="/signup" element={<MembershipPendingPage />} />
    </Routes>
  </AuthProvider>
}

export default App
