import React, { Component } from 'react';
import WrSelect from '../common/Select';
import WrButton from '../common/Button';

export default class Taxation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: 'stcg',
    };
  }

  render() {
    const { tabSelected } = this.state;
    return (
      <div id="wr-taxation" className="wr-card-template">
        <div id="wr-taxation-filter">
          <WrSelect style={{ marginRight: '24px' }}></WrSelect>
          <WrSelect></WrSelect>
        </div>
        <div id="wr-taxation-summary">
          <div className="wr-taxation-summary-col">
            <span className="wr-tsc-value">₹ 2,848</span>
            <span className="wr-tsc-label">Estimated Tax</span>
          </div>
          <div className="wr-vertical-divider"></div>
          <div className="wr-taxation-summary-col">
            <span className="wr-tsc-value">₹ 720</span>
            <span className="wr-tsc-label">Total realized gains</span>
          </div>
          <div className="wr-vertical-divider"></div>
          <div className="wr-taxation-summary-col">
            <span className="wr-tsc-value">₹ 1,536</span>
            <span className="wr-tsc-label">Taxable gains</span>
          </div>
        </div>
        <div id="wr-taxation-detail">
          {['stcg', 'ltcg'].map(tab => (
            <WrButton
              classes={{
                root: tabSelected === tab ? '' : 'wr-outlined-btn'
              }}
              style={{ marginRight: '16px', textTransform: 'uppercase' }}
              onClick={() => this.setState({ tabSelected: tab })}
              disableRipple>
              {tab}
            </WrButton>
          ))}
          <div className="wr-taxation-detail-row">
            <div className="wr-tdr-title"></div>
            <div className="wr-tdr-box"></div>
            <div className="wr-tdr-box"></div>
            <div className="wr-tdr-box"></div>
          </div>
        </div>
      </div>
    );
  }
}