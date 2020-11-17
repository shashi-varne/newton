import React from 'react';
import PageFooter from '../mini-components/PageFooter';
import PageHeader from '../mini-components/PageHeader';
import { IconButton } from 'material-ui';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

const Overview = () => {
  return (
    <div className="iwd-p-scroll-contain" id="iwd-dashboard">
      <PageHeader height="58" hideProfile={isMobileView}>
        <>
          <div className="iwd-header-title">title</div>
          <div className="iwd-header-subtitle">title</div>
        </>
      </PageHeader>
      <div className="iwd-page iwd-p-scroll-child">
        <div id="iwd-d-numbers">
          <div className="iwd-dn-box">
            <div className="iwd-dnb-value">
              ₹72.1 Lacs
            </div>
            <div className="iwd-dnb-label">
              Current value
            </div>
          </div>
          <div className="iwd-dn-box">
            <div className="iwd-dnb-value">
              ₹56.3 Lacs
            </div>
            <div className="iwd-dnb-label">
              Invested value
            </div>
          </div>
          <div className="iwd-dn-box">
            <div className="iwd-dnb-value">
              ₹10.5 Lacs
            </div>
            <div className="iwd-dnb-label">
              Total Realised Gains
            </div>
          </div>
          <div className="iwd-dn-box">
            <div className="iwd-dnb-value">
              17%
            </div>
            <div className="iwd-dnb-label">
              XIRR
            </div>
          </div>
        </div>
        <div id="iwd-d-asset-alloc">

        </div>
        <PageFooter currentPage="1" totalPages="2" />
      </div>
      <div className="iwd-page iwd-p-scroll-child">
        <div id="iwd-d-risk">
          <div className="iwd-card-header">Risk analysis</div>
          <div id="iwd-dr-data">
            <div className="iwd-dr-box border-bottom border-right">
              <div className="iwd-drb-label">Return</div>
              <div className="iwd-drb-value">6%</div>
            </div>
            <div className="iwd-dr-box border-bottom border-right">
              <div className="iwd-drb-label">Alpha</div>
              <div className="iwd-drb-value">8%</div>
            </div>
            <div className="iwd-dr-box border-bottom">
              <div className="iwd-drb-label">Volatility</div>
              <div className="iwd-drb-value">9%</div>
            </div>
            <div className="iwd-dr-box border-right">
              <div className="iwd-drb-label">Beta</div>
              <div className="iwd-drb-value">1.2</div>
            </div>
            <div className="iwd-dr-box border-right">
              <div className="iwd-drb-label">Sharpe Ratio</div>
              <div className="iwd-drb-value">2.3</div>
            </div>
            <div className="iwd-dr-box">
              <div className="iwd-drb-label">Information Ratio</div>
              <div className="iwd-drb-value">1.2</div>
            </div>
          </div>

        </div>
        <div id="iwd-d-newsletter">
          <div className="iwd-card-header">
            Open source and non-custodial protocol enabling the creation of money markets
            </div>
          <IconButton className="iwd-dn-btn">
            <ChevronRight color="white" />
          </IconButton>
          <div id="iwd-dn-gist">
            Equities | Fixed Income | Situational
            </div>
          <div id="iwd-dn-issue">Fisdom Outlook: jULY 2020</div>
        </div>
      </div>
    </div>

  );
};

// export default Overview;