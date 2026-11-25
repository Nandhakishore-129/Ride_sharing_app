import { KM_PER_PX, placeByName } from '../data/places.js'

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// Project a point onto the driver's A→B segment; clamp t so points beyond either end
// are measured from the nearest endpoint rather than from an infinite line.
function project(point, start, end) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const lengthSquared = dx * dx + dy * dy
  const rawT = lengthSquared ? ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared : 0
  const t = Math.max(0, Math.min(1, rawT))
  return { t, d: distance(point, { x: start.x + t * dx, y: start.y + t * dy }) }
}

// Shared fare covers half the direct-route rate plus a small contribution for pickup/drop detours.
export function matchRides(rides, { pickup, drop, userId, maxBudget = Infinity }) {
  const pickupPoint = placeByName(pickup)
  const dropPoint = placeByName(drop)
  if (!pickupPoint || !dropPoint) return []

  return rides.flatMap((ride) => {
    const start = placeByName(ride.from)
    const end = placeByName(ride.to)
    if (!start || !end || ride.driverId === userId || ride.seats < 1) return []

    const pickupProjection = project(pickupPoint, start, end)
    const dropProjection = project(dropPoint, start, end)
    if (pickupProjection.d > 70 || dropProjection.d > 70 || pickupProjection.t >= dropProjection.t) return []

    const km = distance(pickupPoint, dropPoint) * KM_PER_PX
    const detourKm = (pickupProjection.d + dropProjection.d) * KM_PER_PX
    const score = Math.max(40, Math.round(100 - (pickupProjection.d + dropProjection.d) / 1.6 - (ride.rating < 4.6 ? 5 : 0)))
    const fare = Math.max(20, Math.round(km * ride.ratePerKm / 2 + detourKm * 2))
    const soloCabFare = Math.round(km * 18)
    return [{ ...ride, km, detourKm, score, fare, soloCabFare, savings: Math.max(0, soloCabFare - fare) }]
  })
    .filter((ride) => ride.fare <= maxBudget)
    .sort((a, b) => b.score - a.score)
    .map((ride, index) => ({ ...ride, bestMatch: index === 0 }))
}
