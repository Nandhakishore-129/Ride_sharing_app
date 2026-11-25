import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CarFront, CircleDollarSign, Leaf, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'

function HeroPanel() {
  return <aside className="auth-hero"><div className="auth-orb" /><div className="auth-hero-content"><div className="brand auth-brand"><span className="brand-mark"><CarFront size={20} /></span><span>Ride<span className="brand-accent">Sync</span></span></div><div className="auth-headline"><p className="eyebrow">THE SMARTER WAY TO MOVE</p><h1>Share the ride.<br /><span>Save the planet.</span></h1><p>Better routes. Smaller fares. A city that breathes easier.</p></div><ul className="benefit-list"><li><span><CircleDollarSign size={17} /></span>Save more with every shared seat</li><li><span><ShieldCheck size={17} /></span>Safety built into every journey</li><li><span><Leaf size={17} /></span>Make a lighter footprint together</li></ul><div className="auth-map-art"><span /><span /><span /><span /><i>↗</i></div></div></aside>
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = (email = values.email, password = values.password) => {
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    window.setTimeout(() => {
      const result = login(email, password)
      setLoading(false)
      if (result.error) { setError(result.error); return }
      navigate(result.user.role === 'Driver' ? '/offer' : '/find', { replace: true })
    }, 140)
  }

  return <div className="auth-page"><HeroPanel /><main className="auth-main"><motion.section className="auth-card glass-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <div className="auth-card-heading"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to RideSync</h2><p className="muted">Your next better journey starts here.</p></div>
    <form className="form-stack" onSubmit={(event) => { event.preventDefault(); signIn() }} noValidate>
      <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label>
      <label>Password<input type="password" autoComplete="current-password" placeholder="At least 6 characters" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} /></label>
      {error && <p className="field-error" role="alert">{error}</p>}
      <button className="button button-primary full-width" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'} <ArrowRight size={17} /></button>
    </form>
    <div className="form-divider"><span>QUICK DEMO ACCESS</span></div>
    <div className="demo-buttons"><button className="button button-secondary" onClick={() => signIn('rider@demo.com', 'demo123')}>Demo Passenger <ArrowRight size={14} /></button><button className="button button-secondary" onClick={() => signIn('driver@demo.com', 'demo123')}>Demo Driver <ArrowRight size={14} /></button></div>
    <p className="auth-switch">New to RideSync? <Link to="/register">Create an account</Link></p>
  </motion.section><p className="auth-legal">By continuing, you agree to travel thoughtfully.</p></main></div>
}
