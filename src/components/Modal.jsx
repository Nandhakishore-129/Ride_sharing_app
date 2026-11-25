import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, children, onClose, wide = false }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    const dialog = dialogRef.current
    dialog?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialog) {
        const focusable = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
          .filter((element) => !element.disabled)
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus?.() }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`modal-card ${wide ? 'modal-wide' : ''}`}>
        <div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div>
        {children}
      </section>
    </div>
  )
}
