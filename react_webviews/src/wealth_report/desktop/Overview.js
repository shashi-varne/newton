import React, { Component } from 'react';
import { LinearProgress, createMuiTheme, MuiThemeProvider } from 'material-ui';
import Graph from './Graph';
import Tooltip from '../mini-components/tooltip';

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

export default class Overview extends Component {
  render() {
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
          <div className="wr-okn-title" style={{alignItems:'center'}}>XIRR
            <Tooltip />
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