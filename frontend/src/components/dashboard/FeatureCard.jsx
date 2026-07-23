import { Link } from 'react-router-dom'

export default function FeatureCard({
  type,
  title,
  description,
  label,
  button,
  to,
}) {
  return (
    <Link
      to={to}
      className={`main-feature-card ${type}`}
    >

      <div className="feature-icon">
        {type === 'disease' ? '📷' : '✨'}
      </div>

      <span className="feature-label">
        {label}
      </span>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="feature-action">
        {button} →
      </span>

    </Link>
  )
}