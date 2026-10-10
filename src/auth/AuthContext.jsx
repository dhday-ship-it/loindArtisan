import { createContext, useContext, useEffect, useState } from 'react'
import { API_BASE } from '../data.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'artisan_customer_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setCustomer(null)
      setLoading(false)
      return
    }
    let cancelled = false
    fetch(`${API_BASE}/api/artisan-customers/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return
        if (data?.customer) {
          setCustomer(data.customer)
        } else {
          localStorage.removeItem(STORAGE_KEY)
          setToken(null)
          setCustomer(null)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  const applySession = (data) => {
    localStorage.setItem(STORAGE_KEY, data.token)
    setToken(data.token)
    setCustomer(data.customer)
  }

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/artisan-customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? '로그인에 실패했어요.')
    applySession(data)
  }

  const signup = async ({ email, password, name, phone, churchName }) => {
    const res = await fetch(`${API_BASE}/api/artisan-customers/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone, churchName }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? '회원가입에 실패했어요.')
    applySession(data)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setCustomer(null)
  }

  return (
    <AuthContext.Provider value={{ token, customer, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있어요.')
  return ctx
}
