# RideSync

RideSync is a responsive, dark-themed ride-sharing frontend built with React 18 and Vite. It connects passengers and drivers travelling in similar directions with a route-first matching demo, transparent fare estimates, trip coordination and illustrative safety tools.

## Features

- Passenger and driver demo accounts, registration, profile editing and persistent browser sessions.
- Route matching based on projecting pickup and drop-off points onto driver routes.
- Published driver rides, seat bookings, one-time OTPs, live trip simulation, SOS, share and deviation demonstrations.
- Ride history, ratings, personal impact stats and a product analysis page.
- Custom offline SVG city map; no mapping API or backend is required.
- Responsive layouts, keyboard-accessible dialogs, reduced-motion support and toast notifications.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`.

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Passenger | `rider@demo.com` | `demo123` |
| Driver | `driver@demo.com` | `demo123` |

Select either one-click demo button on the sign-in page to start quickly.

## Project structure

```text
src/
  App.jsx, main.jsx, index.css
  components/   shared navigation, map, ride, trip, modal and feedback UI
  context/      authentication and ride/trip state with localStorage persistence
  data/         city places and demo account/ride seed data
  pages/        Login, Register, Find Ride, Offer Ride, My Trips, Analysis, Profile
  utils/        route matching and formatting/storage helpers
```

## How matching works

Each driver offer is a straight line between two of the nine city locations. The matching utility projects the passenger's pickup and drop-off onto that segment and clamps each projection to the segment endpoints. A ride is eligible when both points are at most 70 grid units from the route, the pickup projection comes before the drop projection, at least one seat is open, and the passenger is not the driver.

The route-fit score starts at 100 and decreases with pickup/drop distance, with a small rating penalty for drivers below 4.6 stars. The shared fare is `max($20, round(routeKm × driverRatePerKm / 2 + detourKm × 2))`; matches are ranked by score and optionally filtered by the passenger's budget. City distances use `0.035 km` per SVG grid unit. All figures are illustrative.

## Limitations and roadmap

RideSync is a frontend-only prototype. Credentials and app data live in localStorage, passwords are not hashed, location and trip motion are simulated, and SOS/share/deviation actions do not contact real people or services. Do not use it to coordinate a real emergency or ride.

Next steps include a Node.js backend and database, hashed passwords with JWT/session security, real maps and traffic-aware routing, SMS alerts, UPI payments, multi-stop matching, driver identity verification and women-only ride preferences.
