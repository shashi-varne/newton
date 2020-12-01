// ---------- Asset Imports ------------
import nextArrow from 'assets/fisdom/ic_next_arrow.svg';
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------
import React, { memo, useState } from 'react';
import { Button } from 'material-ui';
import { formattedDate, numDifferentiationInr } from 'utils/validators.js';
import HoldingDetail from './HoldingDetail';
import { withRouter } from 'react-router';
import { navigate as navigateFunc } from '../common/commonFunctions';

const HoldingCard = ({
  mf: mf_detail = {},
  invested_since,
  scheme_type,
  current_earnings: { amount: current_val = 0, percent: xirr = 0 },
  current_invested: invested_val = 0,
  ...props
}) => {
  const [openDetail, setOpenDetail] = useState(false);
  const {
    amc_logo_big = '',
    name,
    fisdom_rating,
    isin = 1,
  } = mf_detail;

  return (
    <div className="iwd-holding-card">
      {openDetail &&
        <HoldingDetail
          isin={isin}
          investmentDetail={{
            name,
            invested_since,
            scheme_type,
            current_val,
            invested_val,
            xirr,
            amcLogo: amc_logo_big,
          }}
          onCloseClick={() => setOpenDetail(false)}
        />
      }
      <div>stars</div>
      <div className="iwd-hc-type">
        {scheme_type}
        <span>|</span>
        Since {formattedDate(invested_since, 'm y')}
      </div>
      <div className="iwd-hc-title">
        <span>{name}</span>
        <img src={amc_logo_big} alt="" height="80" />
      </div>
      <div className="iwd-hc-numbers">
        <div className="iwd-hcn-item">
          <div className="iwd-hcni-value">{numDifferentiationInr(current_val)}</div>
          <div className="iwd-hcni-label">Current</div>
        </div>
        <div className="iwd-hcn-item-divider"></div>
        <div className="iwd-hcn-item">
          <div className="iwd-hcni-value">{numDifferentiationInr(invested_val)}</div>
          <div className="iwd-hcni-label">Invested</div>
        </div>
        <div className="iwd-hcn-item">
          <img src={true ? positive : negative} alt="" />
          <div>
            <div className="iwd-hcni-value">{(xirr ? xirr + '%' : '--')}</div>
            <div className="iwd-hcni-label">XIRR</div>
          </div>
        </div>
      </div>
      <Button
        classes={{
          root: 'iwd-hc-more'
        }}
        onClick={() => setOpenDetail(true)}
      >
        <span>More details</span>
        <img src={nextArrow} alt="" style={{ marginLeft: '15px' }} />
      </Button>
    </div>
  );
};

export default memo(withRouter(HoldingCard));