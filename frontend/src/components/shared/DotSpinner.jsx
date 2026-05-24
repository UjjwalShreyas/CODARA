import '../../styles/dot-spinner.css';

export default function DotSpinner({ color = 'var(--primary)', size = '2.8rem', speed = '0.9s' }) {
  return (
    <div 
      className="dot-spinner" 
      style={{
        '--uib-size': size,
        '--uib-speed': speed,
        '--uib-color': color
      }}
    >
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
}
