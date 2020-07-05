import React, { Component } from 'react';
import Container from '../common/Container';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button } from 'material-ui';
import TopHoldings from '../mini-components/TopHoldingElement';
import { dummyHoldings } from '../constants';
import { navigate, setLoader } from '../common/commonFunctions';
import SettingsIcon from '@material-ui/icons/Settings';
import { Doughnut } from 'react-chartjs-2';
import toast from '../../common/ui/Toast';
import { fetchExternalPortfolio, fetchAllPANs } from '../common/ApiCalls';
import { capitalize } from 'utils/validators';
import { getConfig } from '../../utils/functions';
import { storageService } from '../../utils/validators';

const productType = getConfig().productName;

const doughnutConfigOpts = {
  width: 250,
  height: 250,
  options: {
    layout: {
      padding: {
        left: 0,
      }
    },
    events: [],
    tooltips: { enabled: false },
    maintainAspectRatio: false,
  },
  legend: {
    display: false,
  }
};

const colorsMap = {
  fisdom: ['#DFD8EF', '#7F66BF', '#5F40AF'],
  myway: ['#dbebff', '#94c5ff', '#68aeff'],
};

export default class ExternalPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolio: {},
      show_loader: false,
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      let selectedPan = storageService().getObject('user_pan');
      const userId = storageService().getObject('user_id');
      if (!selectedPan) {
        let pans = await fetchAllPANs();
        [selectedPan] = pans;
      }
      const result = await fetchExternalPortfolio({
        pan: selectedPan,
        userId,
      });
      this.setState({
        portfolio: result.portfolio,
      });
    } catch(err) {
      this.setLoader(false);
      toast(err);
    }
  }

  generateAllocationData = (data) => {
    if (!data) return {};
    const dataKeys = Object.keys(data).sort();
    return {
      labels: dataKeys.map(key => `${capitalize(key)} (${data[key]}%)`),
      datasets: [{
        data: dataKeys.map(key => Number(data[key])),
        backgroundColor: colorsMap[productType],
        borderColor: colorsMap[productType],
      }],
    }
  }

  renderCustomLegend = (data) => {
    data = {
      "equity": 59.21,
      "hybrid": 25.0,
      "debt": 15.79
    };
    const colorScheme = colorsMap[productType];
    return (
      <div id="ext-portfolio-custom-legend">
        {Object.keys(data).sort().map((key, idx) => (
          <div className="custom-legend-item">
            <div className="color-square" style={{ 'background': colorScheme[idx] }}></div>
            <span className="label">{capitalize(key)} </span>
            <span className="label-val">({data[key]}%)</span>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {
      total_investment,
      total_current_value,
      one_day_change,
      xirr: annual_return,
      asset_allocation
    } = this.state.portfolio;
    const assetAllocData = this.generateAllocationData(asset_allocation);

    return (
      <Container
        title="External Portfolio"
        noFooter={true}
        rightIcon={<SettingsIcon />}
        handleRightIconClick={() => this.navigate('settings')}
        hideInPageTitle={true}
        styleHeader={{
          background: 'black',
        }}
        showLoader={this.state.show_loader}
        classHeader="ext-pf-inPageHeader bg-black"
      >
        <div className="fullscreen-banner bg-black">
          <span className="header-title-text" style={{ color: 'white' }}>
            External Portfolio
          </span>
          <div id="selected-pan" onClick={() => this.navigate('select_pan')}>
            <div className="selected-pan-initial">A</div>
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
                  ₹ {total_current_value}
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
                  ₹ {total_investment}
                </div>
              </div>
              <div id="portfolio-odc">
                <div className="pf-detail-title">
                  One day change
                </div>
                <div className="pf-detail-value">
                  <ArrowDropDownIcon style={{ color: '#ba3366', verticalAlign: 'middle', height: '19px'}}/>
                  ₹ {one_day_change} <span>(3.1%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ext-pf-subheader">
          <h4>Asset Allocation</h4>
          <Doughnut data={assetAllocData} {...doughnutConfigOpts}/>
          {this.renderCustomLegend(asset_allocation)}
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


