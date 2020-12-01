import React from 'react';
import StatementCard from '../../mini-components/StatementCard';
const Elss = ({ name }) => {
  return (
    <div className='iwd-statement-report-container'>
      <div className='iwd-statement-title'>{name}</div>
      <div className='iwd-statement-reports'>
        {[1, 2, 3, 4, 1].map((el, idx) => (
          <StatementCard key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Elss;
