import '../../styles/loader.css'

export default function SpeederLoader({ message = 'Analyzing...' }) {
  return (
    <div className="speeder-wrapper">
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="loader">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="base">
          <span></span>
          <div className="face"></div>
        </div>
      </div>
      <p>{message}</p>
    </div>
  )
}