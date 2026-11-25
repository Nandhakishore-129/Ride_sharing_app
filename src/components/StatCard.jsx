import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function StatCard({ label, value, suffix = '', icon: Icon, detail }) {
  const [display, setDisplay] = useState(0)
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (reduceMotion) { setDisplay(value); return undefined }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 650)
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, reduceMotion])
  return (
    <motion.article className="stat-card glass-card" whileHover={reduceMotion ? undefined : { y: -3 }}>
      <div className="stat-card-top"><span>{label}</span><span className="stat-icon"><Icon size={17} /></span></div>
      <strong>{display.toLocaleString()}{suffix}</strong><small>{detail}</small>
    </motion.article>
  )
}
