import '../../styles/card.css'

export default function Card({ 
  title, 
  children, 
  className = '', 
  onClick = null,
  hoverable = false 
}) {
  return (
    <div 
      className={`card ${className} ${hoverable ? 'hoverable' : ''}`}
      onClick={onClick}
    >
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}