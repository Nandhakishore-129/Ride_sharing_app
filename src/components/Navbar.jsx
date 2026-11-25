import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, BarChart3, CarFront, CircleUserRound, Compass, LogOut, MapPinned, Route } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/find', label: 'Find a ride', icon: Compass, role: 'Passenger' },
  { to: '/offer', label: 'Offer a ride', icon: CarFront, role: 'Driver' },
  { to: '/trips', label: 'My trips', icon: Route },
  { to: '/analysis', label: 'Impact', icon: BarChart3 },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const visibleLinks = links.filter((link) => !link.role || user?.role === link.role)
  const signOut = () => { logout(); navigate('/login', { replace: true }) }
  return (
    <header className="topbar">
      <NavLink to={user?.role === 'Driver' ? '/offer' : '/find'} className="brand"><span className="brand-mark"><Activity size={19} /></span><span>Ride<span className="brand-accent">Sync</span></span></NavLink>
      <nav className="desktop-nav" aria-label="Main navigation">
        {visibleLinks.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={16} />{label}</NavLink>)}
      </nav>
      <div className="nav-actions">
        <NavLink to="/profile" className="profile-link" aria-label="Open profile"><span className="avatar avatar-small">{user?.name?.slice(0, 1)}</span><span>{user?.name?.split(' ')[0]}</span></NavLink>
        <button className="icon-button logout-button" onClick={signOut} aria-label="Log out"><LogOut size={17} /></button>
      </div>
    </header>
  )
}
