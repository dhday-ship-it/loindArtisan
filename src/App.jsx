import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'
import { MyPage } from './pages/MyPage.jsx'
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/my" element={<MyPage />} />
    </Routes>
  </AuthProvider>
}

export default App
