import React from 'react' 
import { formatPercentVal } from '../common/commonFunctions';

function Legends({ data = [], columns = 2, classes = {} }) {
  const {
    container: containerClass,
    child: childClass,
    label: labelClass,
    value: valueClass,
    icon: iconClass,
  } = classes;

  return (
    <ul className={`iwd-legend-container ${containerClass}`}>
      {data.map(({name, share}, idx) => (
        <li
          key={name}
          className={`iwd-legend-child ${childClass}`}
          style={{
            width: `${100/columns}%`,
          }}
        >
          <header className="iwd-lc-header">
            <div
              className={`iwd-lc-icon ${iconClass}`}
              style={{ opacity: 1 - (idx / data.length) }}
            ></div>
            <div className={`iwd-lc-title ${labelClass}`}>{name}</div>
          </header>
        <div className={`iwd-lc-value ${valueClass}`}>{formatPercentVal(share)}</div>
        </li>
      ))}
    </ul>
  );
}

export default Legends