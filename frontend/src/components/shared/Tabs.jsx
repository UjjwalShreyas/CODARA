import '../../styles/tabs.css'

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs-wrapper">
      <div className="tabs-buttons">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}