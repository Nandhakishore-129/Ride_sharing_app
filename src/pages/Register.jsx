import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { AuthHero } from './authParts.jsx'

const initial = { name: '', email: '', password: '', role: 'Passenger', emergencyName: '', emergencyPhone: '' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [values, setValues] = useState(initial)
  const [error, setError] = useState('')
  const field = (key, value) => setValues((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (values.name.trim().length < 2) { setError('Enter your name (at least 2 characters).'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { setError('Enter a valid email address.'); return }
    if (values.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (!values.emergencyName.trim() || values.emergencyPhone.trim().length < 5) { setError('Add an emergency contact name and phone number.'); return }
    const result = register({ ...values, name: values.name.trim(), emergencyName: values.emergencyName.trim(), emergencyPhone: values.emergencyPhone.trim() })
    if (result.error) { setError(result.error); return }
    toast('Your RideSync account is ready.')
    navigate(values.role === 'Driver' ? '/offer' : '/find', { replace: true })
  }
  return <div className="auth-page"><AuthHero /><main className="auth-main"><motion.section className="auth-card register-card glass-card" initial={{ opacity:  0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <div className="auth-card-heading"><p className="eyebrow">JOIN THE MOVEMENT</p><h2>Create your account</h2><p className="muted">Smarter journeys start with one small step.</p></div>
    <form className="form-stack" onSubmit={submit} noValidate>
      <label>Full name<input autoComplete="name" value={values.name} onChange={(e) => field('name', e.target.value)} placeholder="Alex Morgan" /></label>
      <label>Email address<input type="email" autoComplete="email" value={values.email} onChange={(e) => field('email', e.target.value)} placeholder="you@example.com" /></label>
      <label>Password<input type="password" autoComplete="new-password" value={values.password} onChange={(e) => field('password', e.target.value)} placeholder="At least 6 characters" /></label>
      <label>I'm joining as<select value={values.role} onChange={(e) => field('role', e.target.value)}><option>Passenger</option><option>Driver</option></select></label>
      <div className="form-section-label">EMERGENCY CONTACT</div>
      <div className="form-row"><label>Contact name<input value={values.emergencyName} onChange={(e) => field('emergencyName', e.target.value)} placeholder="Jamie Morgan" /></label><label>Phone number<input type="tel" value={values.emergencyPhone} onChange={(e) => field('emergencyPhone', e.target.value)} placeholder="+1 555 0100" /></label></div>
      {error && <p className="field-error" role="alert">{error}</p>}
      <button className="button button-primary full-width" type="submit">Create account <ArrowRight size={17} /></button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </motion.section></main></div>
}
