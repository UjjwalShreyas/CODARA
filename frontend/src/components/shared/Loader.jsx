import '../../styles/loader.css';

export default function Loader({ color = '#ffffff', size = '24px', speed = '0.8s' }) {
  return (
    <div 
      className="three-body" 
      style={{
        '--uib-size': size,
        '--uib-speed': speed,
        '--uib-color': color
      }}
    >
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
  );
}
