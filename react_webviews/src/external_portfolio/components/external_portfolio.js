import React, { Component } from 'react';
import Container from '../common/Container';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button } from 'material-ui';
import TopHoldings from '../mini-components/TopHoldingElement';
import { dummyHoldings } from '../constants';
import { navigate } from '../common/commonFunctions';
import SettingsIcon from '@material-ui/icons/Settings';

export default class ExternalPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  render() {
    return (
      <Container
        title="External Portfolio"
        noFooter={true}
        rightIcon={<SettingsIcon />}
        hideInPageTitle={true}
        styleHeader={{
          background: 'black',
        }}
        classHeader="ext-pf-inPageHeader bg-black"
      >
        <div className="fullscreen-banner bg-black">
          <span className="header-title-text" style={{ color: 'white' }}>
            External Portfolio
          </span>
          <div id="selected-pan">
            <div id="selected-pan-initial">A</div>
            <div id="selected-pan-detail">
              <span id="selected-pan-num">DWGPK7557E</span>
              <span id="selected-pan-name">Anant Singh</span>
            </div>
            <ChevronRightIcon style={{ color: 'white' }}/>
          </div>
          <div id="portfolio-details">
            <div className="flex-box">
              <div id="current-value">
                <div className="pf-detail-title">
                  Current value
                </div>
                <div className="pf-detail-value">
                  ₹ 1,23,64,334.00
                </div>
              </div>
              <div id="portfolio-irr">
                <div className="pf-detail-title">
                  IRR
                </div>
                <div className="pf-detail-value">
                  10.8%
                </div>
              </div>
            </div>
            <div className="flex-box">
              <div id="invested-amt">
                <div className="pf-detail-title">
                  Invested amount
                </div>
                <div className="pf-detail-value">
                  ₹ 90,64,334.00
                </div>
              </div>
              <div id="portfolio-odc">
                <div className="pf-detail-title">
                  One day change
                </div>
                <div className="pf-detail-value">
                  <ArrowDropDownIcon style={{ color: '#ba3366', verticalAlign: 'middle', height: '19px'}}/>
                  ₹ 1,00,000.00 <span>(3.1%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ext-pf-subheader">
          <h4>Portfolio performance</h4>
          //Graph goes here
        </div>
        <div className="ext-pf-subheader">
          <h4>Asset Allocation</h4>
          //Graph goes here
        </div>
        <div className="ext-pf-subheader">
          <h4>Top holdings</h4>
          <TopHoldings holdings={dummyHoldings}/>
        </div>
        <Button
          fullWidth={true}
          classes={{
            root: 'fund-holding-btn',
          }}
          onClick={() => this.navigate('fund_holdings')}
        >
          <div id="fund-holding-btn-text">
            Fund Holdings
            <ChevronRightIcon color="primary"/>
          </div>
        </Button>
      </Container>
    );
  }
}


