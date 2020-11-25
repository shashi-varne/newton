import React from 'react'

function Legends({ legends, row = 2 }) {
  return (
    <ul className="iwd-legends">
      {Object.entries(legends).map(([key, share], _, thisArray) => (
        <li
          key={key}
          className="iwd-legend"
          style={{
            flex:
              row === 2
                ? '1 0 50%' : '1 0 33.33%'
          }}
        >
          <header className="iwd-legend-header">
            <div
              className="iwd-legend-icon"
              style={{ opacity: share / 100 + 0.3 }}
            ></div>
            <div className="iwd-legend-title">{key}</div>
          </header>
          <div className="iwd-legend-value">{share}</div>
        </li>
      ))}
    </ul>
  );
}

export default Legends