import { SearchX } from 'lucide-react'

export default function EmptyState({ title = 'No rides found', description = 'Try adjusting your route or search again.', icon: Icon = SearchX, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={25} /></div>
      <h3>{title}</h3><p>{description}</p>
      {action && <button className="button button-secondary" onClick={action.onClick}>{action.label}</button>}
    </div>
  )
}
