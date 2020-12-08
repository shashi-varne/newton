import React from 'react';
import pdf_icon from 'assets/pdf_icon.svg';
import { downloadReport } from '../common/ApiCalls';
import IwdCard from './IwdCard';
const StatementCard = ({ sType, year }) => {
  const handleDownloadReport = async () => {
    downloadReport(sType, year);
  };
  return (
    <IwdCard
      className="iwd-statement-card"
      onClick={handleDownloadReport}
    >
      <>
        <div className='iwd-statement-text-container'>
          <div className='iwd-statement-year-heading'>Financial year</div>
          <div className='iwd-statement-year-value'>{`${year}-${year + 1}`}</div>
        </div>
        <div className='iwd-statement-file-container'>
          <img src={pdf_icon} className='iwd-statement-icon' alt='pdf_icon' />
          {/* <img src={xls_icon} className='iwd-statement-icon' alt='pdf_icon' /> */}
        </div>
      </>
    </IwdCard>
  );
};

export default StatementCard;
