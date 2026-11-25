import { CarFront, Route, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useRides } from '../context/RideContext.jsx'
import { money, shortDate } from '../utils/format.js'
import EmptyState from '../components/EmptyState.jsx'

export default function MyTrips() {
  const { user } = useAuth()
  const { trips } = useRides()
  const mine = trips.filter((trip) => trip.passengerId === user.id || trip.driverId === user.id)
  return <div className="page-section">
    <div className="page-heading"><div><p className="eyebrow">YOUR JOURNEY HISTORY</p><h2>My trips</h2><p className="muted">Every shared journey adds up.</p></div><span className="count-badge">{mine.length} total</span></div>
    {!mine.length ? <EmptyState title="Your journey starts here" description={user.role === 'Driver' ? 'Publish your first ride to meet passengers travelling your way.' : 'Find a route match and your ride history will appear here.'} icon={Route} /> :
      <div className="table-wrap glass-card"><table className="trips-table"><thead><tr><th>Date</th><th>Route</th><th>Role</th><th>Other person</th><th>Fare</th><th>Status</th><th>Rating</th></tr></thead>
        <tbody>{mine.map((trip) => { const isPassenger = trip.passengerId === user.id; return <tr key={trip.id}><td data-label="Date">{shortDate(trip.createdAt)}</td><td data-label="Route"><div className="table-route"><span>{trip.from}</span><i />{trip.to}</div></td><td data-label="Role"><span className="role-chip"><CarFront size={13} />{isPassenger ? 'Passenger' : 'Driver'}</span></td><td data-label="Other person">{isPassenger ? trip.driverName : trip.passengerName}</td><td data-label="Fare"><strong>{money(trip.fare)}</strong></td><td data-label="Status"><span className={`status-chip ${trip.status.toLowerCase()}`}>{trip.status}</span></td><td data-label="Rating">{trip.rating ? <span className="rating"><Star size={13} fill="currentColor" /> {trip.rating}.0</span> : <span className="muted">—</span>}</td></tr> })}</tbody>
      </table></div>}
  </div>
}
