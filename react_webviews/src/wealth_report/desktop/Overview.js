import React, { useState, useEffect } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider, IconButton, CircularProgress } from 'material-ui';
import MyResponsiveLine from '../mini-components/LineGraph';
import { InsightMap, GraphDateRanges } from '../constants';
import Tooltip from 'common/ui/Tooltip';
import toast from '../../common/ui/Toast';
import Dialog from "common/ui/Dialog";
import { getConfig } from "utils/functions";
import { fetchOverview, fetchPortfolioGrowth } from '../common/ApiCalls';
import { formatGrowthData } from '../common/commonFunctions';
import { numDifferentiation } from '../../utils/validators';
const isMobileView = getConfig().isMobileDevice;

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
  const [selectedRange, setSelectedRange] = useState('1 year');
  const [openModal, toggleModal] = useState(false);
  const [graphLoading, setGraphLoad] = useState(true);

  const [overviewData, setOverviewData] = useState({
    insights: [],
    asset_allocation: {},
  });
  const [growthGraph, setGrowthGraph] = useState({});
  useEffect(() => {
    (async() => {
      try {
        setGraphLoad(true);
        const data = await fetchOverview({ pan: props.pan });
        setOverviewData(data);
        const { combined_amount_data, date_ticks } = await fetchPortfolioGrowth({
          pan: props.pan,
          date_range: selectedRange,
        });
        setGraphLoad(false);
        setGrowthGraph({ data: combined_amount_data, date_ticks: filterDateTicks(date_ticks) });
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  }, [props.pan]);

  useEffect(() => {
    (async() => {
      try {
        setGraphLoad(true);
        const { combined_amount_data, date_ticks } = await fetchPortfolioGrowth({
          pan: props.pan,
          date_range: selectedRange,
        });
        setGraphLoad(false);
        setGrowthGraph({ data: combined_amount_data, date_ticks: filterDateTicks(date_ticks) });
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  }, [selectedRange]);

  // TODO: Optimize this function
  const filterDateTicks = (ticks = []) => {
    if (!isMobileView) return ticks;
    else {
      const dividingFactor = parseInt(ticks.length/4);
      const tickIndices = [0, dividingFactor, dividingFactor*2, ticks.length - 1];
      return tickIndices.map(tickIdx => ticks[tickIdx]);
    }
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

  return (
    <React.Fragment>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Key Numbers</div>
        <div id="wr-overview-key-numbers">  
          <div className="wr-okn-box">
            <div className="wr-okn-title">Current Value</div>
            <div className="wr-okn-value">₹{numDifferentiation(overviewData.current_value)}</div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">Total Invested</div>
            <div className="wr-okn-value">₹{numDifferentiation(overviewData.total_invested)}</div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">
              XIRR
              <span style={{ marginLeft: "6px", verticalAlign:'middle' }}>
                {!isMobileView ? 
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
            <div className="wr-okn-value">
              {overviewData.xirr ? `${overviewData.xirr}%` : 'N/A'}
            </div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">Total Realised Gains</div>
            <div className="wr-okn-value">{numDifferentiation(overviewData.realised_gains)}</div>
          </div>
          <div className="wr-okn-box">
            <div className="wr-okn-title">
              Asset Allocation
              &nbsp;&nbsp;
              {assetAllocNums((overviewData.asset_allocation || {}).debt)}
            </div>
          <div className="wr-okn-value">
            <MuiThemeProvider theme={theme}>
              <LinearProgress
                variant="determinate"
                value={parseInt((overviewData.asset_allocation || {}).debt, 10)}
              />
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
            {GraphDateRanges.map(rangeObj => (
              <span
                onClick={() => setSelectedRange(rangeObj.value)}
                className={
                  `${selectedRange === rangeObj.value ? 'selected' : ''}
                  wr-gg-date-select-item`
                }>
                {rangeObj.label}
              </span>
            ))}
          </div>
          {
            graphLoading ?
              (
                <div style={{
                  textAlign: 'center',
                  marginTop: '40%',
                }}>
                  <CircularProgress size={50} thickness={4} />
                </div>
              ) :
              (
                <div style={{ width: '100%', height: '400px', clear: 'right' }}>
                  <MyResponsiveLine
                    data={formatGrowthData(growthGraph.data)}
                    params={{ date_ticks: growthGraph.date_ticks }}
                  ></MyResponsiveLine>
                </div>
              )
          }
        </div>
      </div>
      <div id="portfolio-insights-header">Portfolio Insights</div>
      <div id="wr-portfolio-insights-container">
        {(overviewData.insights).map(insight =>
          <PortfolioCard insight={insight} />
        )}
      </div>
    </React.Fragment>
  );
}

const assetAllocNums = (val = 0) => {
  val = parseInt(val, 10);
  return (
    <span id="wr-okn-asset-alloc-title">
      <span id="left">{val}</span> : <span id="right">{100-val}</span>
    </span>
  );
};

const PortfolioCard = (props) => {
  const { type, tag, Verbatim: verbatim } = props.insight;
  const [expanded, toggleExpand] = useState(false);
  const insight = InsightMap[type] || {};

  return (
    <div className="wr-pi-card-container">
      <div className="wr-pi-card">
        <img
          className="wi-pi-card-img"
          src={insight.icon ? require(`assets/fisdom/${insight.icon}.svg`) : ''} alt=""/>
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