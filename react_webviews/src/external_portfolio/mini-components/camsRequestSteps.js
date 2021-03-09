import React, { Fragment } from 'react';
import { getConfig } from '../../utils/functions';

const productType = getConfig().productName;

export default function CamsRequestSteps() {
  return (
    <Fragment>
      <div className="cas-req-step">
        <div className="cas-req-step-title">
          <b>Step 1:</b> To track all your investments choose "Detailed" as statement type
          </div>
        <img src={require('assets/cams_statement.png')} alt="screenshot" />
      </div>
      <div className="cas-req-step">
        <div className="cas-req-step-title">
          <b>Step 2:</b> Please choose “Specific period” and select
            the date from <span className="highlighted-text">01/Jan/1990</span> to today
          </div>
        <img src={require('assets/cams_period.png')} alt="screenshot" />
      </div>
      <div className="cas-req-step">
        <div className="cas-req-step-title">
          <b>Step 3:</b> To track all transactions select “Without Zero balance folios”
          </div>
        <img src={require('assets/cams_folio.png')} alt="screenshot" />
      </div>
      <div className="cas-req-step">
        <div className="cas-req-step-title">
          <b>Step 4:</b> Keep the same email that you shared with fisdom
          </div>
        <img src={require('assets/cams_email.png')} alt="screenshot" />
      </div>
      <div className="cas-req-step">
        <div className="cas-req-step-title">
          <b>Step 5:</b> Enter password as
          <span className="highlighted-text">
            &nbsp;{productType === 'finity' ? 'finity1234' : 'fisdom1234'}
          </span>
        </div>
        <img src={require('assets/cams_pwd.png')} alt="screenshot" />
      </div>
      <div id="cams-req-footer">
        <p>
          After successful submission, you will receive
          an email from <span> donotreply@camsonline.com</span>.
        </p>
        <p>
          Post that you can go back to complete the remaining 2 steps.
        </p>
      </div>
    </Fragment>
  );
}