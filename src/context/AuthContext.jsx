import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { seedUsers } from '../data/seed.js'
import { createId, readStorage, writeStorage } from '../utils/format.js'

const AuthContext = createContext(null)
const USERS_KEY = 'ridesync-users'
const SESSION_KEY = 'ridesync-session'

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = readStorage(USERS_KEY, null)
    if (stored) return stored
    writeStorage(USERS_KEY, seedUsers)
    return seedUsers
  })
  const [userId, setUserId] = useState(() => readStorage(SESSION_KEY, null))
  const user = users.find((item) => item.id === userId) || null

  const persistUsers = (next) => {
    setUsers(next)
    writeStorage(USERS_KEY, next)
  }

  const login = useCallback((email, password) => {
    const found = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
    if (!found) return { error: 'Email or password is incorrect.' }
    setUserId(found.id)
    writeStorage(SESSION_KEY, found.id)
    return { user: found }
  }, [users])

  const register = useCallback((values) => {
    if (users.some((item) => item.email.toLowerCase() === values.email.trim().toLowerCase())) {
      return { error: 'An account with this email already exists.' }
    }
    const nextUser = { ...values, id: createId(), email: values.email.trim().toLowerCase() }
    persistUsers([...users, nextUser])
    setUserId(nextUser.id)
    writeStorage(SESSION_KEY, nextUser.id)
    return { user: nextUser }
  }, [users])

  const updateProfile = (values) => {
    const next = users.map((item) => item.id === userId ? { ...item, ...values } : item)
    persistUsers(next)
  }

  const logout = () => {
    setUserId(null)
    try { localStorage.removeItem(SESSION_KEY) } catch { /* Storage may be unavailable. */ }
  }

  const value = useMemo(() => ({ user, login, register, updateProfile, logout }), [user, login, register])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
