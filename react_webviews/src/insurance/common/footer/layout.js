import React from 'react';

import Button from '../../ui/Button';
import { capitalize } from 'utils/validators';

export const SummaryLayout = (props) => {
  return (
    <div>
      <div className="FooterSummaryLayout">
        <div className="FlexItem2 padLR15">
          <div className="FooterSummaryLayout_title">Premium</div>
          <div className="FooterSummaryLayout_subtitle">₹ {props.premium} {capitalize(props.paymentFrequency)}</div>
          {
            (props.provider === 'HDFC' && props.paymentFrequency === 'MONTHLY') &&
            <div className="FooterSummaryLayout_hint">*You’ve to pay <b>3 months premiums</b>.</div>
          }
        </div>
        <div className="FlexItem2">
          <Button
            type={props.type}
            {...props} />
        </div>
      </div>
      {
        props.reset &&
        <div className="FooterReset">
          <div className="FooterReset_title" onClick={props.handleReset}>Start Again</div>
          <div className="FooterReset_subtitle">By restart, you will loose all your progress!</div>
        </div>
      }
    </div>
  );
};

export const DefaultLayout = (props) => {
  return (
    <div className="FooterDefaultLayout">
      <div className="FlexItem1">
        <img
          alt=""
          src={props.logo}
          className="FooterImage" />
      </div>
      <div className="FlexItem2">
        <Button
          type={props.type}
          arrow={(props.edit) ? false : true}
          {...props} />
      </div>
    </div>
  );
};
