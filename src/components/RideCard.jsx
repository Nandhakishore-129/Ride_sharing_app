import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, Clock3, MapPin, Star, Users } from 'lucide-react'
import { money } from '../utils/format.js'

export default function RideCard({ ride, onBook }) {
  const reduced = useReducedMotion()
  return (
    <motion.article className={`ride-card glass-card ${ride.bestMatch ? 'best-match' : ''}`} whileHover={reduced ? undefined : { y: -3 }} layout>
      <div className="ride-card-head"><div className="driver-id"><div className="avatar">{ride.driverName?.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><h3>{ride.driverName}</h3><span className="rating"><Star size={13} fill="currentColor" /> {ride.rating?.toFixed(1)} <span className="muted">driver rating</span></span></div></div>{ride.bestMatch && <span className="best-badge">✦ Best match</span>}</div>
      <div className="ride-route"><div className="route-line-art"><i /><i /></div><div><strong>{ride.from}</strong><small>{ride.car} · {ride.time}</small><strong>{ride.to}</strong></div><span className="seats-chip"><Users size={14} /> {ride.seats} left</span></div>
      <div className="ride-tags"><span><MapPin size={13} /> {ride.km.toFixed(1)} km</span><span><Clock3 size={13} /> {ride.score}% route fit</span>{ride.verified && <span><BadgeCheck size={13} /> Verified</span>}</div>
      <div className="ride-card-footer"><div className="fare-block"><strong>{money(ride.fare)}</strong><s>{money(ride.soloCabFare)} solo</s><span className="savings-chip">Save {money(ride.savings)}</span></div><button className="button button-primary button-small" disabled={ride.seats < 1} onClick={() => onBook(ride)}>Book seat</button></div>
    </motion.article>
  )
}
