import { Outlet, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Route, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useRides } from '../context/RideContext.jsx'
import Navbar from './Navbar.jsx'
import BottomNav from './BottomNav.jsx'
import StatCard from './StatCard.jsx'

export default function Layout() {
  const { user } = useAuth()
  const { trips } = useRides()
  const location = useLocation()
  const stats = useMemo(() => {
    const mine = trips.filter((trip) => (trip.passengerId === user?.id || trip.driverId === user?.id) && trip.status === 'Completed')
    return [
      { label: 'Rides shared', value: mine.length, suffix: '', icon: Route, detail: 'Every seat makes a difference' },
      { label: 'Money saved', value: Math.round(mine.reduce((sum, trip) => sum + (trip.savings || 0), 0)), suffix: '', icon: Wallet, detail: 'Compared with a solo cab' },
      { label: 'CO₂ avoided', value: Math.round(mine.reduce((sum, trip) => sum + (trip.km || 0) * 0.12, 0) * 10) / 10, suffix: ' kg', icon: Leaf, detail: 'A lighter footprint, together' },
    ]
  }, [trips, user])
  return (
    <div className="app-shell"><Navbar />
        <main className="main-content">
          <section className="welcome-row"><div><p className="eyebrow">YOUR MOBILITY, IN SYNC</p><h1>Good to see you, {user?.name?.split(' ')[0]} <span className="wave">✦</span></h1><p className="muted">Make every journey a little more meaningful.</p></div><div className="live-pill"><span /> All systems operational</div></section>
          <div className="stats-grid">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}><Outlet /></motion.div>
        </main>
        <BottomNav />
    </div>
  )
}
