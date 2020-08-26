import React, { useState, useEffect, Fragment } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider, IconButton } from 'material-ui';
import WrGrowthGraph from '../mini-components/WrGrowthGraph';
import { InsightMap, GraphDateRanges } from '../constants';
import toast from '../../common/ui/Toast';
import { getConfig } from "utils/functions";
import { fetchOverview, fetchPortfolioGrowth, fetchXIRR } from '../common/ApiCalls';
import { formatGrowthData } from '../common/commonFunctions';
import { numDifferentiation } from '../../utils/validators';
import CardLoader from '../mini-components/CardLoader';
import WrTooltip from '../common/WrTooltip';
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
  const [graphLoading, setGraphLoad] = useState(true); //when loading graph
  const [isLoading, setLoading] = useState(true); //when loading anything else

  const [overviewData, setOverviewData] = useState({
    insights: [],
    asset_allocation: {},
  });
  const [xirrPercent, setXirrPercent] = useState({});
  const [growthGraphData, setgrowthGraphData] = useState({});
  useEffect(() => {
    (async() => {
      try {
        setGraphLoad(true);
        setLoading(true);
        const data = await fetchOverview({ pan: props.pan });
        const xirr_percent = await fetchXIRR({ pan: props.pan, year: 2 });
        setOverviewData(data);
        setXirrPercent(xirr_percent);
        const { combined_amount_data, date_ticks } = await fetchPortfolioGrowth({
          pan: props.pan,
          date_range: selectedRange,
        });
        const formattedData = formatGrowthData(combined_amount_data);
        setgrowthGraphData({
          ...formattedData,
          date_ticks: filterDateTicks(date_ticks),
        });
      } catch (err) {
        console.log(err);
        toast(err);
      }
      setGraphLoad(false);
      setLoading(false);
    })();
  }, [props.pan, selectedRange]);

  // useEffect(() => {
  //   (async() => {
  //     try {
  //       setGraphLoad(true);
  //       const { combined_amount_data, date_ticks } = await fetchPortfolioGrowth({
  //         pan: props.pan,
  //         date_range: selectedRange,
  //       });
  //       const xirr_percent = await fetchXIRR({ pan: props.pan, year: 2 });
  //       setXirrPercent(xirr_percent);
  //       setGraphLoad(false);
  //       setgrowthGraphData({ data: combined_amount_data, date_ticks: filterDateTicks(date_ticks) });
  //     } catch (err) {
  //       console.log(err);
  //       toast(err);
  //     }
  //   })();
  // }, [selectedRange]);

  // TODO: Optimize this function
  const filterDateTicks = (ticks = []) => {
    if (!isMobileView) return ticks;
    else {
      const dividingFactor = parseInt(ticks.length/4, 10);
      const tickIndices = [0, dividingFactor+1, dividingFactor*3, ticks.length - 1];
      return tickIndices.map(tickIdx => ticks[tickIdx]);
    }
  };

  const xirrTooltipContent = (
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

  return (
    <React.Fragment>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Key Numbers</div>
        {
          isLoading ?
          (
            <CardLoader />
          ) :
          (
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
                  <WrTooltip tipContent={xirrTooltipContent} tooltipClass="wr-xirr-info"/>
                </div>
                <div className="wr-okn-value">
                  {xirrPercent.xirr ? `${Math.round(xirrPercent.xirr)}%` : 'N/A'}
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
          )
        }
      </div>
      <div className="wr-card-template">
        <div className="wr-card-template-header">Portfolio Growth</div>
        <div id="wr-growth-graph">
          <div id="wr-gg-date-select">
            {GraphDateRanges.map((rangeObj, idx) => (
              <span
                key={idx}
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
                <CardLoader />
              ) :
              (
                <div>
                  <div id="wr-xirr">
                    XIRR
                    <WrTooltip tipContent={xirrTooltipContent} />
                    <div style={{fontSize:'24px', fontWeight:600, lineHeight:1}}>
                      {xirrPercent.xirr ? `${Math.round(xirrPercent.xirr)}%` : 'N/A'}
                    </div>
                  </div>
                  <div id="wr-xirr-mob">
                    <span>{`XIRR: ${Math.round(xirrPercent.xirr)}%`}</span>
                    <div>
                      <div className="wr-dot"></div>
                      Invested
                    </div>
                    <div>
                      <div className="wr-dot"></div>
                      Current
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '400px', clear: 'right' }}>
                    <WrGrowthGraph
                      data={growthGraphData.data}
                      params={{
                        date_ticks: growthGraphData.date_ticks,
                        min: growthGraphData.min,
                        max: growthGraphData.max,
                      }}
                    ></WrGrowthGraph>
                  </div>
                </div>
              )
          }
        </div>
      </div>
      {
        !isLoading && !!overviewData.insights.length &&
        (
          <Fragment>
            <div id="portfolio-insights-header">Portfolio Insights</div>
            <div id="wr-portfolio-insights-container">
              {(overviewData.insights).map((insight, idx) =>
                <PortfolioCard insight={insight} key={idx} />
              )}
            </div>
          </Fragment>
        )
      }
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
      <div className="wr-pi-card" onClick={() => toggleExpand(!expanded)}>
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