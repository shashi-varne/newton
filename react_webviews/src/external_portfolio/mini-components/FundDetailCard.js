import React, { Component, Fragment } from "react";
import { Chip } from 'material-ui';
import icon from '../../assets/value_for_money_icon.png';

export default class FundDetailCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      fundAMCIcon,
      fund_name,
      scheme_type,
      investment_since,
      current_value,
      xirr: annual_return,
      total_amount_invested: invested_amt,
    } = this.props.fundDetails;
    return (
      <Fragment>
        <div className="fund-details-container">
          <div className="fund-header">
            <img
              src={icon}
              width="40" height="40"
              alt="amc-logo"
            />
            <span id="heading">
              {fund_name}
            </span>
          </div>
          <div className="fund-info">
            <Chip
              size="small"
              label={scheme_type}
              classes={{
                root: 'fund-chip',
                label: 'fund-chip-label'
              }}
            />
            <div className="fund-investment-date">
              Investment since <span>{investment_since}</span>
            </div>
          </div>
          <div className="fund-numbers">
            <div className="current-val">
              <div className="fund-numbers-title">
                Current value
              </div>
              <div className="fund-numbers-value">
                ₹ {current_value}
              </div>
            </div>
            <div className="annual-ret">
              <div className="fund-numbers-title">
                Annual return
              </div>
              <div className="fund-numbers-value">
                {annual_return.toFixed(2)} %
              </div>
            </div>
            <div className="invested-amt">
              <div className="fund-numbers-title">
                Invested amount
              </div>
              <div className="fund-numbers-value">
                ₹ {invested_amt}
              </div>
            </div>
          </div>
        </div>
        <hr style={{
          background: '#eaeaea',
          border: 'none',
          height: '0.5px',
        }}/>
      </Fragment>
    );
  }
}