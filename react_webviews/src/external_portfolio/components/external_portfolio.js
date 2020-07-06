import React, { Component } from 'react';
import Container from '../common/Container';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Button } from 'material-ui';
import TopHoldings from '../mini-components/TopHoldings';
import { navigate, setLoader } from '../common/commonFunctions';
import SettingsIcon from '@material-ui/icons/Settings';
import { Doughnut } from 'react-chartjs-2';
import toast from '../../common/ui/Toast';
import { fetchExternalPortfolio, fetchAllPANs } from '../common/ApiCalls';
import { capitalize } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../utils/functions';
import { storageService, formatAmountInr } from '../../utils/validators';

const productType = getConfig().productName;

const doughnutConfigOpts = {
  width: 250,
  height: 250,
  options: {
    layout: {
      padding: {
        left: 0,
        bottom: 5,
        top: 5,
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
      selectedPan: {},
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      let selectedPan = storageService().getObject('user_pan') || null;
      if (!selectedPan || !selectedPan.pan) {
        let { pans } = await fetchAllPANs();
        selectedPan = { pan: pans[0]};
        storageService().setObject('user_pan', selectedPan);
      }
      const result = await fetchExternalPortfolio({ pan: selectedPan.pan });
      this.setState({
        portfolio: result.response,
        selectedPan,
      });
    } catch(err) {
      console.log(err);
      toast(err);
    }
    this.setLoader(false);
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
    if (!data) return '';
    const colorScheme = colorsMap[productType];
    return (
      <div id="ext-portfolio-custom-legend">
        {Object.keys(data).sort().map((key, idx) => (
          <div className="custom-legend-item" key={idx}>
            <div className="color-square" style={{ 'background': colorScheme[idx] }}></div>
            <span className="label">{capitalize(key)} </span>
            <span className="label-val">({data[key]}%)</span>
          </div>
        ))}
      </div>
    );
  }

  goBack = () => {
    nativeCallback({ action: 'exit', events: this.getEvents('back') });
  }

  render() {
    let {
      total_investment,
      total_current_value,
      one_day_change,
      one_day_change_perc,
      portfolio_xirr: annual_return,
      asset_allocation,
      top_holdings
    } = this.state.portfolio;
    annual_return = Number(annual_return);
    const assetAllocData = this.generateAllocationData(asset_allocation);

    return (
      <Container
        title="External Portfolio"
        noFooter={true}
        noHeader={this.state.show_loader}
        rightIcon={<SettingsIcon />}
        handleRightIconClick={() => this.navigate('settings')}
        hideInPageTitle={true}
        styleHeader={{
          background: 'black',
        }}
        goBack={this.goBack}
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
              <span id="selected-pan-num">{this.state.selectedPan.pan}</span>
              <span id="selected-pan-name">{this.state.selectedPan.name || 'James Bond'}</span>
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
                  {formatAmountInr(total_current_value)}
                </div>
              </div>
              <div id="portfolio-irr">
                <div className="pf-detail-title">
                  IRR
                </div>
                <div
                  className="pf-detail-value"
                  style={{ color: annual_return < 0 ? '#ba3366' : 'var(--secondary)' }}>
                  {annual_return.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="flex-box">
              <div id="invested-amt">
                <div className="pf-detail-title">
                  Invested amount
                </div>
                <div className="pf-detail-value">
                  {formatAmountInr(total_investment)}
                </div>
              </div>
              <div id="portfolio-odc">
                <div className="pf-detail-title">
                  One day change
                </div>
                <div className="pf-detail-value">
                  {Number(one_day_change) ? (one_day_change < 0 ? 
                    <ArrowDropDownIcon style={{ color: '#ba3366', verticalAlign: 'middle', height: '19px' }} /> :
                    <ArrowDropUpIcon style={{ color: 'var(--secondary)', verticalAlign: 'middle', height: '19px' }} />
                    ) : ''
                  }
                  {formatAmountInr(one_day_change)}
                  <span style={{ color: one_day_change < 0 ? '#ba3366' : 'var(--secondary)'}}>
                    &nbsp;({one_day_change_perc}%)
                  </span>
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
          <h4>Top 10 holdings</h4>
          <TopHoldings holdings={top_holdings || []}/>
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


