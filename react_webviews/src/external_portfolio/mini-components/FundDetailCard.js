import React, { Component, Fragment } from "react";
import { Chip } from 'material-ui';
import icon from 'assets/value_for_money_icon.png';
import { formatAmountInr, formattedDate } from "../../utils/validators";

export default class FundDetailCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      amc_logo,
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
              src={amc_logo || icon}
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
                root: `fund-chip fund-chip-${scheme_type}`,
                label: `fund-chip-label fund-chip-label-${scheme_type}`
              }}
            />
            <div className="fund-investment-date">
              Investment since <span>{formattedDate(investment_since, 'd m y')}</span>
            </div>
          </div>
          <div className="fund-numbers">
            <div className="current-val">
              <div className="fund-numbers-title">
                Current value
              </div>
              <div className="fund-numbers-value">
                {formatAmountInr(current_value)}
              </div>
            </div>
            <div className="annual-ret">
              <div className="fund-numbers-title">
                Annual return
              </div>
              <div className="fund-numbers-value"
                style={{ color: annual_return < 0 ? '#ba3366' : 'var(--secondary)'}}>
                {Number(annual_return || '0000.888292').toFixed(2)} %
              </div>
            </div>
            <div className="invested-amt">
              <div className="fund-numbers-title">
                Invested amount
              </div>
              <div className="fund-numbers-value">
                {formatAmountInr(invested_amt)}
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