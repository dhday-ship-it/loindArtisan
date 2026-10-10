import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GroupMenuPanel } from './GroupMenuPanel.jsx'
import { GroupMenuTrigger } from './GroupMenuTrigger.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

// menuOpen/menuTab은 선택적으로 부모가 제어할 수 있다 (예: HomePage의 "LOIND PLEDGED"
// 문구가 이 헤더의 메뉴를 PLEDGED 탭으로 바로 열어야 하는 경우). 안 넘기면 내부에서 관리한다.
export function Header({ menuOpen: controlledOpen, onMenuOpenChange, menuTab: controlledTab, onMenuTabChange } = {}) {
  const [localOpen, setLocalOpen] = useState(false)
  const [localTab, setLocalTab] = useState('service')
  const menuOpen = controlledOpen ?? localOpen
  const menuTab = controlledTab ?? localTab
  const setMenuOpen = onMenuOpenChange ?? setLocalOpen
  const setMenuTab = onMenuTabChange ?? setLocalTab
  const close = () => setMenuOpen(false)
  const { customer } = useAuth()

  return <header>
    <div className="brand-button">
      <GroupMenuTrigger open={menuOpen} onClick={() => { setMenuTab('service'); setMenuOpen(!menuOpen) }} />
      <Link to="/"><b>아티즌</b></Link>
    </div>
    <div className="actions">
      {customer ? <Link to="/my" onClick={close}>마이페이지</Link> : <Link to="/login" onClick={close}>LOGIN</Link>}
      <a href="#contact" onClick={close}>문의</a>
    </div>
    {menuOpen && <GroupMenuPanel key={menuTab} initialTab={menuTab} onClose={close} />}
  </header>
}
