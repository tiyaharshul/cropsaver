import { Link } from 'react-router-dom'

export default function FeatureCard({
  type,
  title,
  description,
  label,
  button,
  to,
}) {
  const isDisease = type === 'disease'

  return (
    <Link
      to={to}
      className={`main-feature-card ${type}`}
    >
      {/* Decorative background */}
      <div className="feature-decoration" />

      <div className="feature-card-top">
        <div className="feature-icon">
          {isDisease ? '🔬' : '✨'}
        </div>

        <span className="feature-card-number">
          {isDisease ? '01' : '02'}
        </span>
      </div>

      <div className="feature-card-content">
        <span className="feature-label">
          {label}
        </span>

        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <div className="feature-action">
        <span>{button}</span>

        <span className="feature-action-arrow">
          →
        </span>
      </div>
    </Link>
  )
}