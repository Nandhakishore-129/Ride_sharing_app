import { useState } from 'react'
import { BadgeCheck, CarFront, Plus, Trash2, Users } from 'lucide-react'
import { places } from '../data/places.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useRides } from '../context/RideContext.jsx'
import { money } from '../utils/format.js'
import EmptyState from '../components/EmptyState.jsx'
import { useToast } from '../components/Toast.jsx'

const blank = { from: 'Railway Station', to: 'Airport', time: '08:30', seats: 3, car: '', ratePerKm: 8 }

export default function OfferRide() {
  const { user } = useAuth()
  const { rides, publishRide, removeRide } = useRides()
  const toast = useToast()
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const mine = rides.filter((ride) => ride.driverId === user.id)
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (form.from === form.to) { setError('Pickup and destination must be different.'); return }
    if (!form.car.trim()) { setError('Enter your car make and model.'); return }
    if (Number(form.seats) < 1 || Number(form.seats) > 8) { setError('Choose between 1 and 8 available seats.'); return }
    if (Number(form.ratePerKm) <= 0) { setError('Price per kilometre must be greater than zero.'); return }
    publishRide({ ...form, seats: Number(form.seats), ratePerKm: Number(form.ratePerKm), driverId: user.id, driverName: user.name, rating: 5, verified: true })
    setForm(blank)
    toast('Your route is published and ready for matches.')
  }
  const remove = (rideId) => { removeRide(rideId); toast('Published ride removed.') }
  return <div className="page-section">
    <div className="page-heading"><div><p className="eyebrow">DRIVER</p><h2>Offer a ride</h2><p className="muted">Share your route. Fill an empty seat.</p></div><span className="secure-label"><BadgeCheck size={16} /> Driver workspace</span></div>
    <div className="find-grid offer-grid"><section className="search-panel glass-card"><div className="panel-title"><div className="panel-icon"><CarFront size={18} /></div><div><h3>Publish your route</h3><p className="muted">Passengers on your way can request a seat.</p></div></div>
      <form className="form-stack" onSubmit={submit}>
        <label>Starting point<select value={form.from} onChange={(e) => change('from', e.target.value)}>{places.map((place) => <option key={place.name}>{place.name}</option>)}</select></label>
        <label>Destination<select value={form.to} onChange={(e) => change('to', e.target.value)}>{places.map((place) => <option key={place.name}>{place.name}</option>)}</select></label>
        <div className="form-row"><label>Departure time<input type="time" value={form.time} onChange={(e) => change('time', e.target.value)} /></label><label>Available seats<input type="number" min="1" max="8" value={form.seats} onChange={(e) => change('seats', e.target.value)} /></label></div>
        <label>Car make and model<input value={form.car} onChange={(e) => change('car', e.target.value)} placeholder="e.g. Honda Civic" /></label>
        <label>Price per kilometre <div className="input-with-prefix"><span>$</span><input type="number" min="1" step="0.5" value={form.ratePerKm} onChange={(e) => change('ratePerKm', e.target.value)} /></div></label>
        {error && <p className="field-error" role="alert">{error}</p>}
        <button className="button button-primary full-width" type="submit"><Plus size={17} /> Publish ride</button>
      </form>
    </section>
    <section className="published-column"><div className="section-title-row"><div><h3>My published rides</h3><p className="muted">Manage routes and passenger bookings.</p></div><span className="count-badge">{mine.length}</span></div>
      {mine.length ? <div className="ride-list">{mine.map((ride) => <article className="published-card glass-card" key={ride.id}><div className="published-head"><div className="route-heading"><span>{ride.from}</span><i /> <span>{ride.to}</span></div><button className="icon-button danger-icon" aria-label={`Remove ride from ${ride.from} to ${ride.to}`} onClick={() => remove(ride.id)}><Trash2 size={17} /></button></div>
        <div className="published-meta"><span><CarFront size={14} /> {ride.car}</span><span>{ride.time}</span><span><Users size={14} /> {ride.seats} / {ride.totalSeats} seats left</span><span>{money(ride.ratePerKm)}/km</span></div>
        <div className="booking-list"><h4>Passenger bookings <span>{ride.bookings?.length || 0}</span></h4>{ride.bookings?.length ? ride.bookings.map((booking) => <div className="booking-row" key={booking.tripId}><span className="avatar avatar-small">{booking.passengerName.slice(0, 1)}</span><strong>{booking.passengerName}</strong><span className="status-chip ongoing">{booking.status}</span></div>) : <p className="muted small-copy">No bookings yet — your route is visible to passengers.</p>}</div>
      </article>)}</div> : <EmptyState title="No rides published" description="Publish a route and we'll find passengers travelling your way." icon={CarFront} />}
    </section></div>
  </div>
}
