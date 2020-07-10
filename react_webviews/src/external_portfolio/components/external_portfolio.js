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
      selectedPan: '',
      selectedPanRank: '',
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'external portfolio',
        see_all_clicked: this.state.seeMoreClicked,
      }
    };

    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      let selectedPan = storageService().get('user_pan') || null;
      let selectedPanRank = storageService().get('user_pan_rank') || null;
      if (!selectedPan) {
        let pans = await fetchAllPANs();
        selectedPan = pans[0];
        selectedPanRank = 1;
        storageService().set('user_pan', selectedPan);
        storageService().set('user_pan_rank', selectedPanRank);
      }
      const result = await fetchExternalPortfolio({ pan: selectedPan });
      this.setState({
        portfolio: result.response,
        selectedPan,
        selectedPanRank,
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
    nativeCallback({ action: 'exit', events: this.sendEvents('back') });
  }

  settingsClicked = () => {
    this.sendEvents('settings');
    this.navigate('settings');
  }

  panSelectClicked = () => {
    this.sendEvents('accounts');
    this.navigate('select_pan');
  }

  fundHoldingsClicked = () => {
    this.sendEvents('fund holdings');
    this.navigate('fund_holdings');
  }

  render() {
    const { selectedPan, selectedPanRank, portfolio, show_loader } = this.state;
    let {
      total_investment,
      total_current_value,
      one_day_change,
      one_day_change_perc,
      portfolio_xirr: annual_return,
      asset_allocation,
      top_holdings
    } = portfolio;
    top_holdings = top_holdings || [];
    annual_return = Number(annual_return);
    const assetAllocData = this.generateAllocationData(asset_allocation);

    return (
      <Container
        title="External Portfolio"
        noFooter={true}
        noHeader={show_loader}
        rightIcon={<SettingsIcon />}
        handleRightIconClick={this.settingsClicked}
        hideInPageTitle={true}
        styleHeader={{
          background: 'black',
        }}
        goBack={this.goBack}
        showLoader={show_loader}
        classHeader="ext-pf-inPageHeader bg-black"
      >
        <div className="fullscreen-banner bg-black">
          <span className="header-title-text-hni" style={{ color: 'white' }}>
            External Portfolio
          </span>
          <div id="selected-pan" onClick={this.panSelectClicked}>
            <div className="selected-pan-initial">
              {selectedPan[0]}
            </div>
            <div id="selected-pan-detail">
              <span id="selected-pan-header">PAN {selectedPanRank || ''}</span>
              <span id="selected-pan-num">{selectedPan}</span>
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
          <h4>Top {top_holdings.length === 10 ? '10 ' : ''}holdings</h4>
          <TopHoldings
            holdings={top_holdings}
            onSeeMoreClicked={() => this.setState({ seeMoreClicked: true })}
          />
        </div>
        <Button
          fullWidth={true}
          classes={{
            root: 'fund-holding-btn',
          }}
          onClick={this.fundHoldingsClicked}
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


