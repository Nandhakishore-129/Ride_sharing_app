import { useState } from 'react'
import { Star } from 'lucide-react'
import Modal from './Modal.jsx'

export default function RatingModal({ driverName, onSubmit }) {
  const [rating, setRating] = useState(5)
  return <Modal title="How was your ride?" onClose={() => onSubmit(null)}>
    <div className="rating-modal-content"><p className="modal-copy">Your feedback helps the RideSync community travel better. Rate your experience with {driverName}.</p>
      <div className="star-picker" role="radiogroup" aria-label="Rate your ride from one to five stars">{[1, 2, 3, 4, 5].map((number) => <button key={number} role="radio" aria-checked={rating === number} aria-label={`${number} star${number > 1 ? 's' : ''}`} onClick={() => setRating(number)}><Star size={31} fill={number <= rating ? 'currentColor' : 'none'} /></button>)}</div>
      <button className="button button-primary full-width" onClick={() => onSubmit(rating)}>Submit rating</button>
    </div>
  </Modal>
}
