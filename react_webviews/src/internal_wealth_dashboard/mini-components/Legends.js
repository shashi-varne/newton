import React from 'react' 

function Legends({ data = {}, columns = 2, classes = {}, percentage = true }) {
  const {
    container: containerClass,
    child: childClass,
    label: labelClass,
    value: valueClass,
    icon: iconClass,
  } = classes;

  return (
    <ul className={`iwd-legend-container ${containerClass}`}>
      {Object.entries(data).map(([key, share]) => (
        <li
          key={key}
          className={`iwd-legend-child ${childClass}`}
          style={{
            width: `${100/columns}%`,
          }}
        >
          <header className="iwd-lc-header">
            <div
              className={`iwd-lc-icon ${iconClass}`}
              style={{ opacity: (share / 100) + 0.3 }}
            ></div>
            <div className={`iwd-lc-title ${labelClass}`}>{key}</div>
          </header>
          <div className={`iwd-lc-value ${valueClass}`}>{Math.round(share, 0)}%</div>
        </li>
      ))}
    </ul>
  );
}

export default Legends