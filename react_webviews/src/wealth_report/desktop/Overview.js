import React, { useState, useEffect, Fragment, useRef } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider, IconButton } from 'material-ui';
import WrGrowthGraph from '../mini-components/WrGrowthGraph';
import { InsightMap, GraphDateRanges, genericErrMsg } from '../constants';
import toast from '../../common/ui/Toast';
import { getConfig } from "utils/functions";
import { fetchOverview, fetchPortfolioGrowth, fetchXIRR } from '../common/ApiCalls';
import { formatGrowthData } from '../common/commonFunctions';
import { numDifferentiationInr, isEmpty, formattedDate } from '../../utils/validators';
import CardLoader from '../mini-components/CardLoader';
import DotDotLoader from '../../common/ui/DotDotLoader';
import WrTooltip from '../common/WrTooltip';
import ErrorScreen from '../mini-components/ErrorScreen';
import InternalStorage from '../InternalStorage';
const isMobileView = getConfig().isMobileDevice;

const theme = createMuiTheme({
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: '10px',
        height: '16px',
        maxWidth: isMobileView ? '310px' : '540px',
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
  const [selectedRange, setSelectedRange] = useState('5 years');
  const [isLoading, setLoading] = useState(true); //when loading anything else

  const [overviewData, setOverviewData] = useState({
    insights: [],
    asset_allocation: {},
  });
  const firstTimeTrigger = useRef(true);
  function usePreviousValue(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
      firstTimeTrigger.current = false;
    });
    if (firstTimeTrigger.current) return value;
    return ref.current;
  }
  const prevPan = usePreviousValue(props.pan);
  useEffect(() => {
    (async() => {
      try {
        const haveDepsChanged = prevPan !== props.pan;
        let portfolio_xirr = InternalStorage.getData('portfolioXirr');
        let overview = InternalStorage.getData('overviewData');
        let graph_xirr;
        if (isEmpty(overview) || isEmpty(portfolio_xirr) || haveDepsChanged) {
          setLoading(true);
          ({ portfolio_xirr, xirr: graph_xirr } = await fetchXIRR({
            pan: props.pan,
            date_range: selectedRange,
            portfolio_xirr: true,
          }));
          overview = await fetchOverview({ pan: props.pan });
        }
        setPortfolioXirr(portfolio_xirr);
        setGraphXirr(graph_xirr);
        setOverviewData(overview);
        InternalStorage.setData('portfolioXirr', portfolio_xirr);
        InternalStorage.setData('graphXirr', graph_xirr);
        InternalStorage.setData('overviewData', overview);
      } catch (err) {
        console.log(err);
        toast(err);
      }
      setLoading(false);
    })();
  }, [props.pan]);

  const [portfolioXirr, setPortfolioXirr] = useState('');
  const [graphXirr, setGraphXirr] = useState('');
  const [xirrLoading, setXirrLoading] = useState({});
  const [growthGraphData, setGrowthGraphData] = useState({});
  const [graphLoading, setGraphLoad] = useState(true); // when loading graph
  const [graphErr, setGraphErr] = useState(false); // for graph error handling
  const prevSelectedRange = usePreviousValue(selectedRange);
  useEffect(() => {
    (async() => {
      try {
        let data = InternalStorage.getData('growthGraphData');
        const hasPanChanged = prevPan !== props.pan;
        const hasRangeChanged = prevSelectedRange !== selectedRange;
        if (isEmpty(data)|| hasPanChanged || hasRangeChanged) {
          setGraphLoad(true);
          setGraphErr(false);
          const { current_amount_data, invested_amount_data, date_ticks } = await fetchPortfolioGrowth({
            pan: props.pan,
            date_range: selectedRange,
          });
          if (
            isEmpty(current_amount_data) ||
            isEmpty(invested_amount_data) ||
            isEmpty(date_ticks)
          ) {
            throw new Error(genericErrMsg);
          }
          data = {
            formattedData: formatGrowthData(current_amount_data, invested_amount_data),
            date_ticks,
          };
          InternalStorage.setData('growthGraphData', data);
        }
        setGrowthGraphData({
          ...data.formattedData,
          date_ticks: filterDateTicks(data.date_ticks),
        });
        setXirrLoading(true);
        let graph_xirr = InternalStorage.getData('graphXirr');
        if (!isEmpty(graph_xirr) || hasRangeChanged) {
          ({ xirr: graph_xirr } = await fetchXIRR({
            pan: props.pan,
            date_range: selectedRange,
            portfolio_xirr: false,
          }));
          setGraphXirr(graph_xirr);
        }
      } catch (err) {
        setGraphErr(true);
        console.log(err);
        toast(err);
      }
      setGraphLoad(false);
      setXirrLoading(false);
    })();
  }, [props.pan, selectedRange]);

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
        XIRR or extended internal return rate is the standard return metrics 
        for measuring the annual performance of the mutual funds
      </div>
    </div>
  )

  return (
    <React.Fragment>
      {props.pan === 'NA' && 
        <div className="wr-unidentified-pan">
          <span style={{ marginRight: "6px", verticalAlign: "middle" }}>
            <img
              src={require(`assets/fisdom/ic-info.svg`)}
              width={12}
              id="wr-i-btn"
              alt=""
            />
          </span>
          <span style={{ verticalAlign: "middle" }}>
            <b>Unidentified PAN:</b> Covers investments for which PAN is not mentioned in all your CAS statements combined.
          </span>
        </div>
      }
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
                <div className="wr-okn-value">{numDifferentiationInr(overviewData.current_value)}</div>
                  <div className="wr-okn-nav">
                    NAV as on {formattedDate(overviewData.latest_nav_date, 'd m, y')}
                  </div>
              </div>
              <div className="wr-okn-box">
                <div className="wr-okn-title">Total Invested</div>
                <div className="wr-okn-value">{numDifferentiationInr(overviewData.total_invested)}</div>
              </div>
              <div className="wr-okn-box">
                <div className="wr-okn-title">
                  XIRR
                  <WrTooltip tipContent={xirrTooltipContent} tooltipClass="wr-xirr-info" forceDirection={true}/>
                </div>
                <div className="wr-okn-value">
                  {`${portfolioXirr ? Number(portfolioXirr).toFixed(1) + '%' : '--'}`}
                </div>
              </div>
              <div className="wr-okn-box">
                <div className="wr-okn-title">Total Realised Gains</div>
                <div className="wr-okn-value">{numDifferentiationInr(overviewData.realised_gains)}</div>
              </div>
              <div className="wr-okn-box">
                <div className="wr-okn-title">
                  <span style={{ verticalAlign: 'middle', lineHeight: 1 }}>
                    Asset Allocation
                  </span>
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
        {graphErr && <ErrorScreen 
          useTemplate={true}
          templateSvgPath="fisdom/exclamation"
          templateText="Could not fetch Growth graph data"
        />}
        {!graphErr &&
          <div id="wr-growth-graph">
            <div
              id="wr-gg-date-select"
              style={{ cursor: graphLoading ? "not-allowed" : "pointer" }}>
              {GraphDateRanges.map((rangeObj, idx) => (
                <span
                  key={idx}
                  onClick={() => graphLoading ? '' : setSelectedRange(rangeObj.value)}
                  className={
                    `${selectedRange === rangeObj.value ? 'selected' : ''}
                  wr-gg-date-select-item`
                  }>
                  {rangeObj.label}
                </span>
              ))}
            </div>
            <div style={{ clear: 'right' }}>
              <div id="wr-xirr">
                XIRR
              <WrTooltip tipContent={xirrTooltipContent} forceDirection={true} />
                <div style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: 1,
                  marginTop: '8px'
                }}>
                  {xirrLoading ?
                    <DotDotLoader className="wr-dot-loader" /> :
                  `${graphXirr ? Number(graphXirr).toFixed(1) + '%' : '--'}`
                  }
                </div>
              </div>
              <div id="wr-xirr-mob">
                <span id="wr-xm-irr">
                  IRR: {`${graphXirr && !xirrLoading ? Number(graphXirr).toFixed(1) + '%' : '--'}`}
                </span>
                <div>
                  <div className="wr-dot"></div>
                  <span>Invested</span>
                </div>
                <div>
                  <div className="wr-dot"></div>
                  <span>Current</span>
                </div>
              </div>
              {
                graphLoading ?
                  (
                    <CardLoader />
                  ) :
                  (
                    <Fragment>
                      <WrGrowthGraph
                        data={growthGraphData.data}
                        width="100%"
                        height="400px"
                        params={{
                          date_ticks: growthGraphData.date_ticks,
                          min: growthGraphData.min,
                          max: growthGraphData.max,
                        }}
                      ></WrGrowthGraph>
                    </Fragment>
                  )
              }
            </div>
          </div>
        }
      </div>
      <div
        id="portfolio-insights-header"
        className="animated animatedFadeInUp fadeInUp">
        Portfolio Insights
      </div>
      {isLoading ?
        <CardLoader /> :
        <div id="wr-portfolio-insights-container">
          {(overviewData.insights).map((insight, idx) =>
            <PortfolioCard insight={insight} key={idx} />
          )}
        </div>
      }
    </React.Fragment>
  );
}

const assetAllocNums = (val = 0) => {
  val = parseInt(val, 10);
  return (
    <span id="wr-okn-asset-alloc-title">
      <span id="left">Equity ({val})</span> : <span id="right">Debt ({100-val})</span>
    </span>
  );
};

const PortfolioCard = (props) => {
  const { type, tag, Verbatim: verbatim } = props.insight;
  const [expanded, toggleExpand] = useState(false);
  const insight = InsightMap[type] || {};

  return (
    <div className="wr-pi-card-container animated animatedFadeInUp fadeInUp">
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