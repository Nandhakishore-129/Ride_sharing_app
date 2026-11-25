import { AlertTriangle, PhoneCall, ShieldCheck } from 'lucide-react'
import Modal from './Modal.jsx'

export default function SosModal({ user, car, onClose }) {
  return <Modal title="Emergency support" onClose={onClose}>
    <div className="sos-content"><div className="sos-emblem"><ShieldCheck size={25} /></div>
      <p className="modal-copy">Your live location and vehicle details have been sent to <strong>{user?.emergencyName || 'your emergency contact'}</strong> at <strong>{user?.emergencyPhone || 'the number on your profile'}</strong>.</p>
      <div className="notice-box"><AlertTriangle size={17} /><span>If you are in immediate danger, call emergency services now.</span></div>
      <a className="button button-danger full-width" href="tel:112"><PhoneCall size={17} /> Call 112</a>
      <button className="button button-secondary full-width" onClick={onClose}>I’m safe</button>
      <small className="muted">Ride vehicle: {car || 'vehicle details unavailable'}</small>
      <small className="muted">Prototype simulation only — no real alert or live location is transmitted.</small>
    </div>
  </Modal>
}
