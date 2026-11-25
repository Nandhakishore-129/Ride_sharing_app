import { NavLink } from 'react-router-dom'
import { BarChart3, CarFront, Compass, Route } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function BottomNav() {
  const { user } = useAuth()
  const items = user?.role === 'Driver'
    ? [{ to: '/offer', label: 'Offer', icon: CarFront }, { to: '/trips', label: 'Trips', icon: Route }, { to: '/analysis', label: 'Impact', icon: BarChart3 }]
    : [{ to: '/find', label: 'Find', icon: Compass }, { to: '/trips', label: 'Trips', icon: Route }, { to: '/analysis', label: 'Impact', icon: BarChart3 }]
  return <nav className="bottom-nav" aria-label="Mobile navigation">{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'bottom-link active' : 'bottom-link'}><Icon size={20} /><span>{label}</span></NavLink>)}</nav>
}
