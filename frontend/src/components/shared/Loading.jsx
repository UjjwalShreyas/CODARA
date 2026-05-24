import '../../styles/loading.css'
import DotSpinner from './DotSpinner'

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <DotSpinner color="var(--primary)" size="3rem" />
      <p style={{ marginTop: '1rem' }}>{message}</p>
    </div>
  )
}