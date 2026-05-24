import React from 'react';
import '../../styles/bauhaus.css';

export default function BauhausLanguageSelector({ value, onChange }) {
  const languages = [
    { id: 'javascript', label: 'JavaScript', shape: 'shape-circle' },
    { id: 'typescript', label: 'TypeScript', shape: 'shape-square' },
    { id: 'python', label: 'Python', shape: 'shape-triangle' },
    { id: 'java', label: 'Java', shape: 'shape-diamond' },
    { id: 'cpp', label: 'C++', shape: 'shape-circle' },
    { id: 'go', label: 'Go', shape: 'shape-square' },
    { id: 'ruby', label: 'Ruby', shape: 'shape-triangle' }
  ];

  return (
    <div className="bauhaus-container">
      <div className="bauhaus-group">
        <div className="bauhaus-header">
          <span className="title">Select Language</span>
        </div>
        <div className="radio-options">
          {languages.map((lang) => (
            <label key={lang.id} className="radio-item">
              <input
                type="radio"
                name="language"
                value={lang.id}
                checked={value === lang.id}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="selector-box">
                <div className={`shape ${lang.shape}`}></div>
              </div>
              <span className="label-text">{lang.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
