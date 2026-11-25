export const money = (value) => `$${Number(value || 0).toFixed(2)}`

export const shortDate = (value) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))

export const createId = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
