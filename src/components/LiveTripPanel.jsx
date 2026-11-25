import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Copy, MapPin, ShieldAlert } from 'lucide-react'
import { money } from '../utils/format.js'

export default function LiveTripPanel({ trip, onComplete, onSos, onShare, onDeviation, onProgress }) {
  const [progress, setProgress] = useState(trip.progress || 0)
  const [deviated, setDeviated] = useState(false)
  const completed = useRef(false)
  const progressRef = useRef(trip.progress || 0)
  useEffect(() => {
    if (deviated || completed.current) return undefined
    const timer = window.setInterval(() => {
      const next = Math.min(100, progressRef.current + 2)
      progressRef.current = next
      setProgress(next)
      onProgress(next)
      if (next === 100 && !completed.current) {
        completed.current = true
        window.clearInterval(timer)
        window.setTimeout(() => onComplete(), 400)
      }
    }, 500)
    return () => window.clearInterval(timer)
  }, [deviated, onComplete, onProgress])

  const handleDeviation = () => { setDeviated(true); onDeviation() }
  return (
    <section className="live-panel glass-card">
      <div className="live-heading"><div><span className="live-label"><i /> LIVE TRIP</span><h2>You're on your way</h2></div><span className="otp-chip">OTP <strong>{trip.otp}</strong></span></div>
      {deviated && <div className="deviation-banner" role="alert"><AlertTriangle size={17} /> Route deviation detected, alert sent to {trip.emergencyName || 'your emergency contact'}.</div>}
      <div className="live-route-summary"><span><MapPin size={15} />{trip.from}</span><span className="live-dash" /><span><MapPin size={15} />{trip.to}</span></div>
      <div className="progress-meta"><span>Trip progress</span><strong>{Math.round(progress)}%</strong></div>
      <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
      <div className="live-money"><div><small>Shared fare</small><strong>{money(trip.fare)}</strong></div><div><small>You save</small><strong className="text-green">{money(trip.savings)}</strong></div><div><small>Driver</small><strong>{trip.driverName}</strong></div></div>
      <div className="live-actions"><button className="button button-danger" onClick={onSos}><ShieldAlert size={16} /> SOS</button><button className="button button-secondary" onClick={onShare}><Copy size={16} /> Share trip</button><button className="button button-quiet" onClick={handleDeviation} disabled={deviated}>Simulate deviation</button></div>
      <p className="live-footnote">Share your OTP with {trip.driverName} when you meet. This demo trip completes automatically.</p>
    </section>
  )
}
