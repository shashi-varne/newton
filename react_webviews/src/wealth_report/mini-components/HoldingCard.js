import React, { Component } from 'react';
import WrButton from '../common/Button';
import WrTable from './WrTable';
import { IconButton } from '@material-ui/core';

export default class HoldingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: 'fund',
      expanded: false,
      condition: true
    };
  }

  renderFundDetails = () => (
    <div id="wr-hce-fund-details">
      <div>
        <span className="wr-small-col-val">10 Aug, 2016</span>
        <span className="wr-small-col-title">Launch Date</span>
      </div>
      <div>
        <span className="wr-small-col-val">₹ 1.2Cr </span>
        <span className="wr-small-col-title">AUM</span>
      </div>
      <div>
        <span className="wr-small-col-val">₹ 1.6L</span>
        <span className="wr-small-col-title">1 Year Return</span>
      </div>
      <div id="wr-hce-space"></div> {/*This div is required to create space for mobile view*/}
      <div>
        <span className="wr-small-col-val">₹ 4.5L</span>
        <span className="wr-small-col-title">3 Year Return</span>
      </div>
      <div>
        <span className="wr-small-col-val">₹ 6.7L</span>
        <span className="wr-small-col-title">5 Year Return</span>
      </div>
    </div>
  );

  renderPastTransactions = () => (
    <div id="wr-hce-past-trx">
      <WrTable></WrTable>
    </div>
  );

  render() {
    const { tabSelected, expanded } = this.state;

    return (
      <div className="wr-card-template">
        {/* based on the condition visbility is modified */}
        {this.state.condition && <div className="wr-amc-label">
          <img src={require('assets/fisdom/label.svg')} alt="amc-logo" id="wr-amc-img" />
        </div>}
        <div className="wr-holding-card">
          {AMCDetail()}
          <div className="wr-hc-user-data">
            <div className="wr-small-col">
              <span className="wr-small-col-val">₹ 10.3L</span>
              <span className="wr-small-col-title">Invested Amount</span>
            </div>
            <div className="wr-small-col">
              <span className="wr-small-col-val">₹ 12.5L</span>
              <span className="wr-small-col-title">Current Value</span>
            </div>
            <div className="wr-small-col">
              <span className="wr-small-col-val">23%</span>
              <span className="wr-small-col-title">IRR</span>
            </div>
            <div>
              <IconButton classes={{ root: 'wr-icon-button' }} color="inherit" aria-label="Menu" onClick={() => this.setState({ expanded: !this.state.expanded })}>
                <img
                  src={require(`assets/fisdom/${expanded ? 'down_arrow_fisdom' : 'ic-right-chevron' }.svg`)}
                  alt="expand"
                  style={{ cursor: 'pointer' }}/>
              </IconButton>
            </div>
          </div>
        </div>
        {expanded ? 
          (<div className="wr-holding-card-expand">
            <div className="wr-holdings-btn">
              {[
                {tabName: 'fund', label: 'Fund Summary'},
                {tabName: 'transactions', label: 'Past Transactions'},
               ].map(({ tabName, label }) => (
                <WrButton
                  classes={{
                    root: tabSelected === tabName ? '' : 'wr-outlined-btn'
                  }}
                  style={{ marginRight: '16px' }}
                  onClick={() => this.setState({ tabSelected: tabName })}
                  disableRipple>
                  {label}
                </WrButton>
                )
              )}
            </div>
            <div>
              {tabSelected === 'fund' ?
                this.renderFundDetails() : this.renderPastTransactions()
              }
            </div>
          </div>) : ''
        }
      </div>
    );
  }
}

const AMCDetail = () => (
    <div className="wr-hc-amc-detail">
    <img className="amc-logo" src={require('assets/fisdom/ic-investment-strategy.svg')} alt="amc-logo"/>
    <div style={{ marginRight: '36px', maxWidth: '68%' }}>
      <div className="amc-detail-title">Axis Long Term Equity GrAxis Long Term Equity GrAxis Long Term Equity Gr</div>
      <div className="amc-detail-subtitle">ELSS (Tax Savings) · Since Aug 2019</div>
      {/* // visbility will be modified based on the condition */}
      {this && <div className="wr-EL-label">Free from EL / Lock-in</div>}
    </div>
    {FisdomRating(4)}
  </div>
);

const FisdomRating = (rating) => (
  <div
    className="wr-fisdom-rating"
    style={{
      background: rating < 4 ? 'rgba(208,2,27,0.1)' : 'rgba(86,174,98,0.1)'
    }}>
    <span
      className="rating-num"
      style={{ color: rating < 4 ? '#d0021b' : '#56ae62' }}>
      {rating}
    </span>
    <img
      alt="star"
      src={require(`assets/ic-star-${rating < 4 ? 'red' : 'green'}.svg`)}
      className="rating-star"
    />
  </div>
);