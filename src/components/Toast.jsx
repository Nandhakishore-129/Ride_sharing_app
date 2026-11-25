import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const showToast = useCallback((message, type = 'success') => {
    window.clearTimeout(timer.current)
    setToast({ message, type, id: Date.now() })
    timer.current = window.setTimeout(() => setToast(null), 3600)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const value = useMemo(() => showToast, [showToast])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && <motion.div key={toast.id} role="status" className={`toast ${toast.type}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span><button aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></button>
        </motion.div>}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
