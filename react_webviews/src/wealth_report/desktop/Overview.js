import React, { Component } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider } from 'material-ui';
import Graph from './Graph';
// import Tooltip from 'common/ui/Tooltip';
import Tooltip from '@material-ui/core/Tooltip';


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
    },
    MuiTooltip: {
      popper: {
        // margin:'0 255px 0 235px',
        backgroundColor:'yellow'
      },
      tooltip: {
        backgroundColor:'green !important',
        opacity:'1',
      }
    }
  }
});

export default class Overview extends Component {
  render() {

    // const logo = (
    //   <img
    //     src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
    //     style={{ cursor: "pointer" }}
    //     alt=""
    //     data-tip={'tipcontent'}
    //   />
    // );

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

    return (
      <div>
        <div id="wr-overview-key-numbers" className="wr-card-template">
        <div className="wr-okn-box">Key Numbers</div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">Current Value</div>
          <div className="wr-okn-value">₹ 2.83Cr</div>
        </div>
        <div className="wr-okn-box">
          <div className="wr-okn-title">Analysis</div>
          <div className="wr-okn-value">₹ 56.3L</div>
        </div>
        <div className="wr-okn-box">
          <div className="wr-okn-title" >XIRR
            <span style={{margin:'0 0 0 6px'}}>
              {/* <Tooltip tip={logo} content={tipcontent} /> */}
              {/* <MuiThemeProvider theme={theme}> */}
                <Tooltip title={tipcontent}>
                  <span style={{backgroundColor:'white !important'}}>
                  <img
                  src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
                  style={{ cursor: "pointer" }}
                  alt=""
                />
                  </span>
                
                </Tooltip>
              {/* </MuiThemeProvider> */}
              
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
        {/* <Graph></Graph> */}
        <div id="portfolio-insights-header">Portfolio Insights</div>
        <div id="wr-portfolio-insights-container">
          {portfolioCard()}
          {portfolioCard()}
          {portfolioCard()}
          {portfolioCard()}
          {portfolioCard()}
          {portfolioCard()}
        </div>
      </div>
    );
  }
}

const assetAllocNums = (val) => (
  <span id="wr-okn-asset-alloc-title">
    <span id="left">{val}</span> : <span id="right">{100-val}</span>
  </span>
);

const portfolioCard = (title, subtitle, icon, desc) => (
  <div className="wr-pi-card">
    <img src={require('assets/fisdom/ic-investment-strategy.svg')} alt="" />
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