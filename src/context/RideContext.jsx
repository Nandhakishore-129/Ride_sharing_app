import { createContext, useContext, useMemo, useState } from 'react'
import { seedRides } from '../data/seed.js'
import { createId, readStorage, writeStorage } from '../utils/format.js'

const RideContext = createContext(null)
const RIDES_KEY = 'ridesync-rides'
const TRIPS_KEY = 'ridesync-trips'

export function RideProvider({ children }) {
  const [rides, setRides] = useState(() => readStorage(RIDES_KEY, seedRides))
  const [trips, setTrips] = useState(() => readStorage(TRIPS_KEY, []))

  const saveRides = (next) => { setRides(next); writeStorage(RIDES_KEY, next) }
  const saveTrips = (next) => { setTrips(next); writeStorage(TRIPS_KEY, next) }

  const publishRide = (ride) => saveRides([{ ...ride, id: createId(), bookings: [], totalSeats: ride.seats }, ...rides])
  const removeRide = (rideId) => saveRides(rides.filter((ride) => ride.id !== rideId))

  const bookRide = ({ ride, passenger, pickup, drop }) => {
    const otp = String(Math.floor(1000 + Math.random() * 9000))
    const trip = {
      id: createId(), rideId: ride.id, passengerId: passenger.id, passengerName: passenger.name,
      driverId: ride.driverId, driverName: ride.driverName, role: 'Passenger',
      from: pickup, to: drop, pickup: ride.from, destination: ride.to,
      fare: ride.fare, soloCabFare: ride.soloCabFare, savings: ride.savings, km: ride.km,
      otp, status: 'Ongoing', progress: 0, rating: null, createdAt: new Date().toISOString(),
      car: ride.car, time: ride.time,
    }
    const updatedRides = rides.map((item) => item.id === ride.id
      ? { ...item, seats: item.seats - 1, bookings: [...(item.bookings || []), { passengerId: passenger.id, passengerName: passenger.name, tripId: trip.id, status: 'Ongoing' }] }
      : item)
    saveRides(updatedRides)
    saveTrips([trip, ...trips])
    return trip
  }

  const updateTrip = (tripId, updates) => saveTrips(trips.map((trip) => trip.id === tripId ? { ...trip, ...updates } : trip))
  const value = useMemo(() => ({ rides, trips, publishRide, removeRide, bookRide, updateTrip }), [rides, trips])
  return <RideContext.Provider value={value}>{children}</RideContext.Provider>
}

export const useRides = () => useContext(RideContext)
