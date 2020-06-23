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
      fundName,
      fundType,
      investmentDate,
      currentValue,
      annualReturn,
      investedAmt,
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
              {fundName}
            </span>
          </div>
          <div className="fund-info">
            <Chip
              size="small"
              label={fundType}
              classes={{
                root: 'fund-chip',
                label: 'fund-chip-label'
              }}
            />
            <div className="fund-investment-date">
              Investment since <span>{investmentDate}</span>
            </div>
          </div>
          <div className="fund-numbers">
            <div className="current-val">
              <div className="fund-numbers-title">
                Current value
              </div>
              <div className="fund-numbers-value">
                ₹ {currentValue}
              </div>
            </div>
            <div className="annual-ret">
              <div className="fund-numbers-title">
                Annual return
              </div>
              <div className="fund-numbers-value">
                {annualReturn} %
              </div>
            </div>
            <div className="invested-amt">
              <div className="fund-numbers-title">
                Invested amount
              </div>
              <div className="fund-numbers-value">
                ₹ {investedAmt}
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