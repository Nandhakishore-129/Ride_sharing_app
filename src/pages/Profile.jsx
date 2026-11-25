import { useEffect, useState } from 'react'
import { BadgeCheck, Save, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const [values, setValues] = useState({ name: user.name, emergencyName: user.emergencyName || '', emergencyPhone: user.emergencyPhone || '' })
  const [error, setError] = useState('')
  useEffect(() => setValues({ name: user.name, emergencyName: user.emergencyName || '', emergencyPhone: user.emergencyPhone || '' }), [user])
  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (values.name.trim().length < 2) { setError('Name must be at least 2 characters.'); return }
    if (!values.emergencyName.trim() || values.emergencyPhone.trim().length < 5) { setError('Add a valid emergency contact name and phone number.'); return }
    updateProfile({ ...values, name: values.name.trim(), emergencyName: values.emergencyName.trim(), emergencyPhone: values.emergencyPhone.trim() })
    toast('Profile details saved.')
  }
  return <div className="page-section">
    <div className="page-heading"><div><p className="eyebrow">YOUR ACCOUNT</p><h2>Profile & safety</h2><p className="muted">Keep your details current for a smoother trip.</p></div><span className="secure-label"><ShieldCheck size={16} /> Protected profile</span></div>
    <div className="profile-layout"><aside className="profile-summary glass-card"><div className="profile-avatar"><UserRound size={32} /></div><h3>{user.name}</h3><p>{user.email}</p><span className="role-chip"><BadgeCheck size={14} />{user.role}</span><div className="profile-security"><ShieldCheck size={16} /><span>Your emergency contact is used only for trip-safety demonstrations.</span></div></aside>
      <form className="profile-form glass-card" onSubmit={submit}><div className="panel-title"><div className="panel-icon"><UserRound size={18} /></div><div><h3>Personal details</h3><p className="muted">Update your name and emergency contact.</p></div></div>
        <label>Full name<input autoComplete="name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>
        <label>Email address<input value={user.email} disabled /><small className="muted">Email address cannot be changed in this prototype.</small></label>
        <div className="form-section-label">EMERGENCY CONTACT</div><label>Contact name<input value={values.emergencyName} onChange={(e) => setValues({ ...values, emergencyName: e.target.value })} /></label><label>Phone number<input type="tel" value={values.emergencyPhone} onChange={(e) => setValues({ ...values, emergencyPhone: e.target.value })} /></label>
        {error && <p className="field-error" role="alert">{error}</p>}<button className="button button-primary" type="submit"><Save size={16} /> Save changes</button>
      </form></div>
  </div>
}
