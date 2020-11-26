import React from 'react';
import pdf_icon from 'assets/pdf_icon.svg';
import xls_icon from 'assets/xls_icon.svg';
const StatementCard = () => {
  return (
    <div className='iwd-card iwd-statement-card'>
      <div className='iwd-statement-text-container'>
        <div className='iwd-statement-year-heading'>Financial year</div>
        <div className='iwd-statement-year-value'>2017-2018</div>
      </div>
      <div className='iwd-statement-file-container'>
        <img src={pdf_icon} className='iwd-statement-icon' alt='pdf_icon' />
        <img src={xls_icon} className='iwd-statement-icon' alt='pdf_icon' />
      </div>
    </div>
  );
};

export default StatementCard;
