import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Layout from './components/Layout.jsx'
import Analysis from './pages/Analysis.jsx'
import FindRide from './pages/FindRide.jsx'
import Login from './pages/Login.jsx'
import MyTrips from './pages/MyTrips.jsx'
import OfferRide from './pages/OfferRide.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (role && user.role !== role) return <Navigate to={user.role === 'Driver' ? '/offer' : '/find'} replace />
  return children
}

function PublicOnly({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to={user.role === 'Driver' ? '/offer' : '/find'} replace /> : children
}

function NotFound() {
  return <div className="not-found"><span className="not-found-code">404</span><h1>This route doesn’t exist.</h1><p className="muted">Looks like this journey took a wrong turn.</p><a href="#/">Back to RideSync</a></div>
}

export default function App() {
  return <ToastProvider><Routes>
    <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
    <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<HomeRedirect />} />
      <Route path="find" element={<ProtectedRoute role="Passenger"><FindRide /></ProtectedRoute>} />
      <Route path="offer" element={<ProtectedRoute role="Driver"><OfferRide /></ProtectedRoute>} />
      <Route path="trips" element={<MyTrips />} />
      <Route path="analysis" element={<Analysis />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes></ToastProvider>
}

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user?.role === 'Driver' ? '/offer' : '/find'} replace />
}
