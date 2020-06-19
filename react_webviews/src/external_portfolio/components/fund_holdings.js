import React, { Component, Fragment } from 'react';
import Container from '../common/Container';
import { Chip } from 'material-ui';
import icon from '../../assets/value_for_money_icon.png';

class FundHoldings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderFund = () => {
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
              HDFC Multicap Builder Capital growth fund
            </span>
          </div>
          <div className="fund-info">
            <Chip
              size="small"
              label="EQUITY"
              classes={{
                root: 'fund-chip',
                label: 'fund-chip-label'
              }}
            />
            <div className="fund-investment-date">
              Investment since <span>01 Jan 2013</span>
            </div>
          </div>
          <div className="fund-numbers">
            <div className="current-val">
              <div className="fund-numbers-title">
                Current value
              </div>
              <div className="fund-numbers-value">
                ₹ 1,20,83,345
              </div>
            </div>
            <div className="annual-ret">
              <div className="fund-numbers-title">
                Annual return
              </div>
              <div className="fund-numbers-value">
                10.80%
              </div>
            </div>
            <div className="invested-amt">
              <div className="fund-numbers-title">
                Invested amount
              </div>
              <div className="fund-numbers-value">
                ₹ 98,32,345
              </div>
            </div>
          </div>
        </div>
        <hr/>
      </Fragment>
    );
  }

  render() {
    return (
      <Container
        title="Fund Holdings"
        noFooter={true}
      >
        {this.renderFund()}
      </Container>
    );
  }
}

export default FundHoldings;