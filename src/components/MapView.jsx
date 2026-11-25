import { useMemo } from 'react'
import { CarFront } from 'lucide-react'
import { places, placeByName } from '../data/places.js'

function routeLine(ride, className, key) {
  const from = placeByName(ride.from)
  const to = placeByName(ride.to)
  if (!from || !to) return null
  return <line key={key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} />
}

export default function MapView({ rides = [], highlightedRide, pickup, drop, progress = 0, live = false }) {
  const start = placeByName(pickup)
  const end = placeByName(drop)
  const carPosition = useMemo(() => {
    if (!start || !end) return null
    return { x: start.x + (end.x - start.x) * progress / 100, y: start.y + (end.y - start.y) * progress / 100 }
  }, [start, end, progress])
  return (
    <div className="map-frame">
      <svg className="city-map" viewBox="0 0 600 380" role="img" aria-label="Illustrated city map with ride routes">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(147,160,189,.11)" strokeWidth="1" /></pattern>
          <linearGradient id="passenger-route" x1="0" x2="1"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#60a5fa" /></linearGradient>
        </defs>
        <rect width="600" height="380" fill="#10182d" /><rect width="600" height="380" fill="url(#grid)" />
        <path d="M-20 100 C120 155 180 40 310 90 S480 210 640 145 M-20 280 C120 220 225 360 360 270 S500 250 640 330 M140 -30 C180 90 90 180 160 410 M330 -20 C280 110 390 180 340 410 M505 -20 C450 90 570 180 500 410" className="map-road" />
        {rides.map((ride, index) => routeLine(ride, `route-faint ${highlightedRide?.id === ride.id ? 'route-highlight' : ''}`, ride.id || index))}
        {highlightedRide && routeLine(highlightedRide, 'route-highlight', 'highlighted')}
        {start && end && <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className="passenger-route" />}
        {places.map((place) => <g key={place.name}><circle cx={place.x} cy={place.y} r="3" className="place-dot" /><text x={place.x + 7} y={place.y - 8} className="map-label">{place.name}</text></g>)}
        {start && <g><circle cx={start.x} cy={start.y} r="8" className="pickup-pin" /><text x={start.x + 9} y={start.y + 17} className="pin-label">PICKUP</text></g>}
        {end && <g><circle cx={end.x} cy={end.y} r="8" className="drop-pin" /><text x={end.x + 9} y={end.y + 17} className="pin-label">DROP-OFF</text></g>}
        {live && carPosition && <g transform={`translate(${carPosition.x - 12} ${carPosition.y - 12})`}><circle cx="12" cy="12" r="15" className="car-halo" /><foreignObject width="24" height="24"><div className="map-car"><CarFront size={17} /></div></foreignObject></g>}
      </svg>
      <div className="map-legend"><span><i className="legend-dot blue" /> Your route</span><span><i className="legend-dot green" /> Driver route</span><span>Illustrative city map</span></div>
    </div>
  )
}
