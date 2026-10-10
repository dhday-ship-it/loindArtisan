import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { API_BASE } from '../data.js'
import '../work.css'
import '../auth/auth-pages.css'

const STATUS_META = {
  PAID: { label: '접수완료', cls: 'order-status-pending' },
  IN_PRODUCTION: { label: '제작중', cls: 'order-status-wip' },
  INTERNAL_REVIEW: { label: '운영진 검수중', cls: 'order-status-wip' },
  DRAFT_SENT: { label: '시안 전달됨', cls: 'order-status-wip' },
  REVISION_REQUESTED: { label: '수정요청', cls: 'order-status-pending' },
  APPROVED: { label: '최종승인', cls: 'order-status-done' },
  DELIVERED: { label: '전달완료', cls: 'order-status-done' },
  CANCELLED: { label: '취소', cls: 'order-status-cancelled' },
}

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function MyPage() {
  const { token, customer, loading, logout } = useAuth()
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetch(`${API_BASE}/api/artisan-customers/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled && Array.isArray(data?.orders)) setOrders(data.orders) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [token])

  if (loading) return null
  if (!token || !customer) return <Navigate to="/login" replace />

  return <div className="site-shell" id="top">
    <Header />
    <main>
      <div className="mypage">
        <div className="mypage-header">
          <h1>내 의뢰 내역</h1>
          <button type="button" className="mypage-logout" onClick={logout}>로그아웃</button>
        </div>
        <p className="mypage-sub">{customer.churchName ? `${customer.churchName} · ` : ''}{customer.name}님, {customer.email}로 접수하신 의뢰를 모아 보여드려요.</p>

        {orders === null && <p className="mypage-empty">불러오는 중...</p>}
        {orders !== null && orders.length === 0 && (
          <p className="mypage-empty">아직 접수하신 의뢰가 없어요.</p>
        )}
        {orders !== null && orders.length > 0 && (
          <div className="order-card-list">
            {orders.map((o) => {
              const meta = STATUS_META[o.status] ?? { label: o.status, cls: 'order-status-wip' }
              return (
                <div key={o.id} className="order-card">
                  <img src={o.work.imageUrl} alt="" />
                  <div className="order-card-body">
                    <div className="order-card-top">
                      <span className="order-card-category">{o.work.category}</span>
                      <span className="order-card-date">{formatDate(o.createdAt)}</span>
                    </div>
                    <p className="order-card-title">{o.work.title}</p>
                    <p className="order-card-text">{o.requestText}</p>
                    {(o.draftFileUrl || o.finalFileUrl) && (
                      <div className="order-card-files">
                        {o.draftFileUrl && <a href={o.draftFileUrl} target="_blank" rel="noreferrer">시안 파일 보기 ↗</a>}
                        {o.finalFileUrl && <a href={o.finalFileUrl} target="_blank" rel="noreferrer">최종 파일 보기 ↗</a>}
                      </div>
                    )}
                  </div>
                  <span className={`order-status-badge ${meta.cls}`}>{meta.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  </div>
}
