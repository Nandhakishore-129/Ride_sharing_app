import { useCallback, useMemo, useState } from 'react'
import { ArrowRight, LocateFixed, Search, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useRides } from '../context/RideContext.jsx'
import { places } from '../data/places.js'
import { matchRides } from '../utils/matching.js'
import { money } from '../utils/format.js'
import EmptyState from '../components/EmptyState.jsx'
import LiveTripPanel from '../components/LiveTripPanel.jsx'
import MapView from '../components/MapView.jsx'
import Modal from '../components/Modal.jsx'
import RatingModal from '../components/RatingModal.jsx'
import RideCard from '../components/RideCard.jsx'
import SosModal from '../components/SosModal.jsx'
import { useToast } from '../components/Toast.jsx'

export default function FindRide() {
  const { user, updateProfile } = useAuth()
  const { rides, trips, bookRide, updateTrip } = useRides()
  const toast = useToast()
  const [pickup, setPickup] = useState('Old Town')
  const [drop, setDrop] = useState('Tech Park')
  const [budget, setBudget] = useState('')
  const [hasSearched, setHasSearched] = useState(true)
  const [loading, setLoading] = useState(false)
  const [activeTripId, setActiveTripId] = useState(null)
  const [showSos, setShowSos] = useState(false)
  const [completedTrip, setCompletedTrip] = useState(null)
  const [progress, setProgress] = useState(0)
  const [confirmation, setConfirmation] = useState(null)

  const activeTrip = trips.find((trip) => trip.id === activeTripId && trip.status === 'Ongoing')
    || trips.find((trip) => trip.passengerId === user.id && trip.status === 'Ongoing')
  const matches = useMemo(() => hasSearched ? matchRides(rides, { pickup, drop, userId: user.id, maxBudget: budget ? Number(budget) : Infinity }) : [], [rides, pickup, drop, user.id, budget, hasSearched])
  const mapRides = rides.filter((ride) => ride.seats > 0)
  const runSearch = (event) => {
    event.preventDefault()
    if (pickup === drop) { toast('Choose different pickup and drop-off locations.', 'error'); return }
    setLoading(true)
    setHasSearched(false)
    window.setTimeout(() => { setHasSearched(true); setLoading(false) }, 480)
  }
  const book = (ride) => setConfirmation(ride)
  const confirmBooking = () => {
    if (!confirmation) return
    const ride = matches.find((item) => item.id === confirmation.id)
    if (!ride) return
    const trip = bookRide({ ride, passenger: user, pickup, drop })
    setProgress(0)
    setActiveTripId(trip.id)
    setConfirmation(null)
    toast('Seat booked. Your live trip is ready.')
  }
  const finishTrip = useCallback((trip) => {
    updateTrip(trip.id, { status: 'Completed', progress: 100 })
    setCompletedTrip(trip)
    setActiveTripId(null)
  }, [updateTrip])
  const onComplete = useCallback(() => {
    if (activeTrip) finishTrip(activeTrip)
  }, [activeTrip, finishTrip])
  const onProgress = useCallback((value) => setProgress(value), [])
  const share = async () => {
    const text = `RideSync trip: ${activeTrip?.from || pickup} to ${activeTrip?.to || drop}. Driver: ${activeTrip?.driverName}. OTP: ${activeTrip?.otp}.`
    try {
      await navigator.clipboard.writeText(text)
      toast('Trip details copied to clipboard.')
    } catch {
      toast(text, 'error')
    }
  }
  const submitRating = (rating) => {
    if (rating) {
      updateTrip(completedTrip.id, { rating })
      if (user.role === 'Driver') updateProfile({ name: user.name })
      toast('Thanks for rating your ride.')
    }
    setCompletedTrip(null)
  }
  const triggerDeviation = () => {
    if (activeTrip) updateTrip(activeTrip.id, { deviation: true, emergencyName: user.emergencyName })
  }

  return <div className="page-section">
    <div className="page-heading"><div><p className="eyebrow">PASSENGER</p><h2>Find your ride</h2><p className="muted">A better route starts with a shared one.</p></div><span className="secure-label"><ShieldCheck size={16} /> Safety-first matching</span></div>
    {activeTrip ? <div className="find-grid live-grid"><div className="stack-gap"><MapView rides={mapRides} highlightedRide={rides.find((ride) => ride.id === activeTrip.rideId)} pickup={activeTrip.from} drop={activeTrip.to} progress={progress} live /><LiveTripPanel trip={{ ...activeTrip, emergencyName: user.emergencyName }} onComplete={onComplete} onSos={() => setShowSos(true)} onShare={share} onDeviation={triggerDeviation} onProgress={onProgress} /></div><div className="trip-side-note glass-card"><div className="side-note-icon"><LocateFixed size={20} /></div><h3>Your trip, in sync</h3><p className="muted">Your route is monitored in real time. Keep your OTP private until you meet your driver.</p><div className="trip-status-line"><i /> Live tracking active</div></div></div> :
    <div className="find-grid">
      <div className="stack-gap">
        <form className="search-panel glass-card" onSubmit={runSearch}>
          <div className="panel-title"><div className="panel-icon"><Search size={18} /></div><div><h3>Where are you headed?</h3><p className="muted">Tell us your route and budget.</p></div></div>
          <div className="form-stack">
            <label>Pickup location<select value={pickup} onChange={(event) => setPickup(event.target.value)}>{places.map((place) => <option key={place.name}>{place.name}</option>)}</select></label>
            <div className="swap-route"><span>ROUTE</span><ArrowRight size={14} /></div>
            <label>Drop-off location<select value={drop} onChange={(event) => setDrop(event.target.value)}>{places.map((place) => <option key={place.name}>{place.name}</option>)}</select></label>
            <label>Maximum fare <div className="input-with-prefix"><span>$</span><input aria-label="Maximum fare in dollars" type="number" min="0" placeholder="No limit" value={budget} onChange={(event) => setBudget(event.target.value)} /></div></label>
            <button type="submit" className="button button-primary full-width" disabled={loading}>{loading ? 'Finding your matches…' : 'Match my route'} <ArrowRight size={17} /></button>
          </div>
        </form>
        <div className="map-panel glass-card"><div className="section-title-row"><div><h3>City routes</h3><p className="muted">Shared rides, mapped simply.</p></div><span className="offline-tag">OFFLINE MAP</span></div><MapView rides={mapRides} highlightedRide={matches[0]} pickup={pickup} drop={drop} /></div>
      </div>
      <div className="results-column"><div className="section-title-row results-heading"><div><h3>Route matches <span className="count-badge">{matches.length}</span></h3><p className="muted">{hasSearched ? `Drivers going your way · ${pickup} → ${drop}` : 'Finding the best routes for you…'}</p></div><span className="match-live"><i /> LIVE</span></div>
        {loading ? <div className="skeleton-list">{[1, 2].map((item) => <div className="skeleton-card" key={item}><span /><span /><span /></div>)}</div> : matches.length ? <div className="ride-list">{matches.map((ride) => <RideCard key={ride.id} ride={ride} onBook={book} />)}</div> : <EmptyState title="No routes in sync yet" description="No available drivers match this direction and budget. Try a nearby place or raise your fare limit." />}
        <div className="trust-note"><ShieldCheck size={16} /><span>Every match is sorted by route fit, not ad spend.</span></div>
      </div>
    </div>}
    {confirmation && <Modal title="Confirm your seat" onClose={() => setConfirmation(null)}><div className="confirm-content"><p className="modal-copy">You're booking a shared ride with <strong>{confirmation.driverName}</strong>.</p><div className="confirm-route"><span>{pickup}</span><ArrowRight size={15} /><span>{drop}</span></div><div className="confirm-fare"><span>Your shared fare</span><strong>{money(confirmation.fare)}</strong></div><p className="muted small-copy">You'll receive a one-time OTP and live trip tracking as soon as you book.</p><button className="button button-primary full-width" onClick={confirmBooking}>Confirm and book seat</button></div></Modal>}
    {showSos && <SosModal user={user} car={activeTrip?.car} onClose={() => setShowSos(false)} />}
    {completedTrip && <RatingModal driverName={completedTrip.driverName} onSubmit={submitRating} />}
  </div>
}
