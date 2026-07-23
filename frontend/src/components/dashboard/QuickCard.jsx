import { Link } from 'react-router-dom'

export default function QuickCard({
  icon,
  title,
  description,
  to,
}) {
  return (
    <Link to={to} className="quick-card">

      <div className="quick-icon">
        {icon}
      </div>

      <div className="quick-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <span className="quick-arrow">
        →
      </span>

    </Link>
  )
}