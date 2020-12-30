import React from 'react';
import pdf_icon from 'assets/pdf_icon.svg';
// import xls_icon from 'assets/xls_icon.svg';
import IwdCard from './IwdCard';
import { getConfig } from '../../utils/functions';
import { nativeCallback } from '../../utils/native_callback';

const StatementCard = ({ sType, year }) => {
  const handleDownloadReport = async () => {
    sendEvents('download_report', sType);
    window.open(`${getConfig().base_url}/printpage/invest/export/mine/${sType}?year=${year}`, '_blank');
  };

  const sendEvents = (user_action, sType) => {
    let eventObj = {
      "event_name": 'internal dashboard hni',
      "properties": {
        screen_name: 'statements',
        "user_action": user_action,
        report_type: sType,
      }
    };
    nativeCallback({ events: eventObj });
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
