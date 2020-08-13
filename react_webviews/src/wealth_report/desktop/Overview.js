import React, { useState } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider } from 'material-ui';
import MyResponsiveLine from '../mini-components/LineGraph';
import { growthObj1mo, growthObj3mo, growthObj6mo, growthObjYear, growthObj3Year, growthObj5Year, createGrowthData } from '../constants';
import Tooltip from 'common/ui/Tooltip';
import Dialog from "common/ui/Dialog";
import { getConfig, isMobileDevice } from "utils/functions";

const dateRanges = [{
    label: getConfig().isMobileDevice ? '1m' : '1 Month',
    value: '1 month',
    dateObj: growthObj1mo,
    tickFormat: '%b %d',
    tickInterval: 'every 2 days',
  }, {
    label: getConfig().isMobileDevice ? '3m' : '3 Months',
    value: '3 months',
    dateObj: growthObj3mo,
    tickFormat: '%b %d',
    tickInterval: 'every week',
  }, {
    label: getConfig().isMobileDevice ? '6m' : '6 Months',
    value: '6 months',
    dateObj: growthObj6mo,
    tickFormat: '%b %d',
    tickInterval: 'every 15 days',
  }, {
    label: getConfig().isMobileDevice ? '1y' : '1 Year',
    value: '1 year',
    dateObj: growthObjYear,
    tickFormat: '%b',
    tickInterval: 'every month',
  }, {
    label: getConfig().isMobileDevice ? '3y' : '3 Years',
    value: '3 years',
    dateObj: growthObj3Year,
    tickFormat: '%b %y',
    tickInterval: 'every 3 months',
  }, {
    label: getConfig().isMobileDevice ? '5y' : '5 Years',
    value: '5 years',
    dateObj: growthObj5Year,
    tickFormat: '%b %y',
    tickInterval: 'every 5 months',
  }];

const theme = createMuiTheme({
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: '4px',
        height: '36px',
        maxWidth: '540px',
        margin: 'auto',
        backgroundColor: '#7357ba !important',
      },
      bar1Determinate: {
        backgroundColor: '#cbbeee',
      },
    }
  }
});

export default function Overview(props) {
  const [timeRange, setRange] = useState(dateRanges[0]);
  const [dateOb, setGrowthObj] = useState(dateRanges[0].dateObj);
  const [openModal, toggleModal] = useState(false);

  const selectRange = (rangeObj) => {
    setRange(rangeObj);
    setGrowthObj(rangeObj.dateObj); // This will be replaced by API data
  };
  const tipcontent = (
    <div className="wr-xirr-tooltip">
      <div className="wr-tooltip-head">
        XIRR ( Extended Internal Return Rate)
        </div>
      <div className="wr-tooltip-content">
        XIRR or extended internal return rate is the standard return metricis
        for measuring the annual performance of the mutual funds
        </div>
    </div>
  )

  const i_btn = (
    <img
      src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
      style={{
        height: isMobileDevice() && "10px",
        width: isMobileDevice() && "10px",
      }}
      alt=""
      onClick={() => toggleModal(true)}
    />
  );

  return (
    <React.Fragment>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Key Numbers</div>
        <div id="wr-overview-key-numbers"></div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">Current Value</div>
          <div className="wr-okn-value">₹ 2.83Cr</div>
        </div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">Analysis</div>
          <div className="wr-okn-value">₹ 56.3L</div>
        </div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">
            XIRR
            <span style={{ marginLeft: "6px", verticalAlign:'middle' }}>
              {!isMobileDevice() ? 
              <Tooltip content={tipcontent} direction="down" className="wr-xirr-info">
                {i_btn}
              </Tooltip> : 
              <React.Fragment>
                {i_btn}
                <Dialog
                  open={openModal}
                  onClose={() => toggleModal(false)}
                  classes={{ paper: "wr-dialog-info" }}
                >
                  {tipcontent}
                </Dialog>
              </React.Fragment>
              }
            </span>
          </div>

          <div className="wr-okn-value">17%</div>
        </div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">Total Realised Gains</div>
          <div className="wr-okn-value">₹ 38.23L</div>
        </div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">Asset Allocation &nbsp;&nbsp;{assetAllocNums(37)}</div>
          <div className="wr-okn-value">
            <MuiThemeProvider theme={theme}>
              <LinearProgress variant="determinate" value={37} />
            </MuiThemeProvider>
          </div>
        </div>
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Portfolio Growth</div>
        <div id="wr-growth-graph">
          <div id="wr-gg-date-select">
          {dateRanges.map(rangeObj => (
            <span
              onClick={() => selectRange(rangeObj)}
              className={
                `${timeRange.value === rangeObj.value ? 'selected' : ''}
                wr-gg-date-select-item`
              }>
              {rangeObj.label}
            </span>
          ))}
          </div>
          <div style={{ width: '100%', height: '400px', clear: 'right'}}>
            <MyResponsiveLine
              data={createGrowthData(dateOb)}
              params={{ tickFormat: timeRange.tickFormat, tickInterval: timeRange.tickInterval }}
            ></MyResponsiveLine>
          </div>
        </div>
      </div>
      <div id="portfolio-insights-header">Portfolio Insights</div>
      <div id="wr-portfolio-insights-container">
        {portfolioCard()}
        {portfolioCard()}
        {portfolioCard()}
        {portfolioCard()}
        {portfolioCard()}
        {portfolioCard()}
      </div>
    </React.Fragment>
  );
}

const assetAllocNums = (val) => (
  <span id="wr-okn-asset-alloc-title">
    <span id="left">{val}</span> : <span id="right">{100-val}</span>
  </span>
);

const portfolioCard = (title, subtitle, icon, desc) => (
  <div className="wr-pi-card">
    <img src={require('assets/fisdom/ic-investment-strategy.svg')} alt=""/>
    <div className="wr-pi-content">
      <div className="wr-pi-content-title">
        Investment Strategy
      </div>
      <div className="wr-pi-content-subtitle">
        Very Conservative
      </div>
      <div className="wr-pi-content-desc">
        Your investment strategy is very conservative, generally recommended for people approaching their
        retirement.
      </div>
    </div>
  </div>
);