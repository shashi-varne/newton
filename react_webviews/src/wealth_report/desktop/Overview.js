import React, { useState, useEffect } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider, IconButton } from 'material-ui';
import MyResponsiveLine from '../mini-components/LineGraph';
import { growthObj1mo, growthObj3mo, growthObj6mo, growthObjYear, growthObj3Year, createGrowthData } from '../constants';
import Tooltip from 'common/ui/Tooltip';
import toast from '../../common/ui/Toast';
import Dialog from "common/ui/Dialog";
import { getConfig, isMobileDevice } from "utils/functions";
import { fetchOverview } from '../common/ApiCalls';

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
    dateObj: {},
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
  const [timeRange, setRange] = useState(dateRanges[1]);
  const [dateOb, setGrowthObj] = useState(dateRanges[1].dateObj);
  const [openModal, toggleModal] = useState(false);

  const [overviewData, setOverviewData] = useState();
  useEffect(async () => {
    try {
      const data = await fetchOverview({ pan: props.pan });
      setOverviewData(data);
    } catch (err) {
      console.log(err);
      toast(err);
    }
  });

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
      id="wr-i-btn"
      alt=""
      onClick={() => toggleModal(true)}
    />
  );
  console.log(createGrowthData(growthObj3mo));
  return (
    <React.Fragment>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Key Numbers</div>
        <div id="wr-overview-key-numbers">  
          <div className="wr-okn-box">
            <div className="wr-okn-title">Current Value</div>
            <div className="wr-okn-value">₹ {overviewData.current_value}</div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">Total Invested</div>
            <div className="wr-okn-value">₹ {overviewData.total_invested}</div>
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
            <div className="wr-okn-value">{overviewData.xirr}%</div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">Total Realised Gains</div>
            <div className="wr-okn-value">₹ {overviewData.realised_gains}</div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">
              Asset Allocation
              &nbsp;&nbsp;
              {assetAllocNums(overviewData.asset_allocation.debt)}
            </div>
          <div className="wr-okn-value">
            <MuiThemeProvider theme={theme}>
              <LinearProgress variant="determinate" value={Number(overviewData.asset_allocation.debt)} />
            </MuiThemeProvider>
            <div className="wr-metrics">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
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
        {overviewData.insights.map(insight => (
          portfolioCard(insight)
        ))}
      </div>
    </React.Fragment>
  );
}

const assetAllocNums = (val) => (
  <span id="wr-okn-asset-alloc-title">
    <span id="left">{val}</span> : <span id="right">{100-val}</span>
  </span>
);

const insightMap = {
  'portfolio_composition': {
    icon: 'assets/fisdom/ic-investment-strategy.svg',
    title: 'Portfolio Composition',
  }, 
  'investment_strategy': {
    icon: 'assets/fisdom/ic-investment-strategy.svg',
    title: 'Investment Strategy',
  },

}
const portfolioCard = ({ type, tag, verbatim }) => {
  const [expanded, toggleExpand] = useState(false);
  const insight = insightMap[type];

  return (
    <div className="wr-pi-card-container">
      <div className="wr-pi-card">
        <img className="wi-pi-card-img" src={require(insight.icon)} alt=""/>
        <div className="wr-pi-content">
          <div className="wr-pi-content-title">
            {insight.title}
          </div>
          <span className="wr-pi-content-subtitle">
            {tag}
          </span>
          <div className="wr-pi-content-desc">
            {verbatim}
          </div>
        </div>
        <div className="wr-pi-card-expand">
          <IconButton classes={{ root: 'wr-icon-button' }} color="inherit" aria-label="Menu" onClick={() => toggleExpand(!expanded)}>
            <img
              src={require(`assets/fisdom/${expanded ? 'down_arrow_fisdom' : 'ic-right-chevron'}.svg`)}
              alt="expand"
              style={{ cursor: 'pointer' }} />
          </IconButton>
        </div>
      </div>
      {
        expanded && (
          <div className="wr-pi-card-expanded">
            <div className="wi-pi-card-img"></div>
            <div className="wr-pi-content-desc">
              {verbatim}
            </div>
          </div>
        )
      }
    </div>
  );
};