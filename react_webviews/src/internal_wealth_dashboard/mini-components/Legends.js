import React from 'react'

function Legends({ legends }) {
  return (
    <ul className="iwd-legends">
      {Object.entries(legends).map(([key, share], _, thisArray) => (
        <li
          key={key}
          className="iwd-legend"
          style={{
            width:
              thisArray.length <= 4
                ? thisArray.length <= 3
                  ? `${100 / thisArray.length}`
                  : '50%'
                : '30%',
          }}
        >
          <header className="iwd-legend-header">
            <div
              className="iwd-legend-icon"
              style={{ opacity: share / 100 }}
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