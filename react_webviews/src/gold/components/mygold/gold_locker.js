import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';
import toast from '../../../common/ui/Toast';
import {
  inrFormatDecimal2
} from 'utils/validators';

import { isUserRegistered, gold_providers } from '../../constants';

class GoldLocker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      user_info: {},
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      error: false,
      errorMessage: '',
      provider: 'mmtc',
      productName: getConfig().productName,
      reportData: [],
      mmtc_info: {},
      mmtc_info_local: gold_providers['mmtc'],
      safegold_info: {},
      safegold_info_local: gold_providers['safegold'],
      selected_provider_info: {}
    }
  }


  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  setProviderData(provider, result1, result2, result3) {
    let isRegistered = isUserRegistered(result1);
    let data = result1.gold_user_info.provider_info;
    data.isRegistered = isRegistered;
    data.user_info = result1.gold_user_info.user_info
    data.sell_value = ((result2.sell_info.plutus_rate) * (data.gold_balance || 0)).toFixed(2) || 0;
    data.provider = provider;
    data.local = gold_providers[provider];

    data.reportData = result3.orders ? result3.orders.all : [];

    for (var i=0; i< data.reportData.length; i++) {
      data.reportData[i].cssMapper = this.statusMapper(data.reportData[i]);
    }

    this.setState({
      [provider + '_info']: data,
      user_info: data.user_info
    });

    if (provider === 'safegold') {
      this.setState({
        show_loader: false
      })
    }

  }

  async onloadProvider(provider) {
    try {

      let result1 = {};
      let result2 = {};
      let result3 = {};
      const res = await Api.get('/api/gold/user/account/' + provider);
      if (res.pfwresponse.status_code === 200) {
        result1 = res.pfwresponse.result;
      } else {
        this.setState({
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
      }

      const res2 = await Api.get('/api/gold/sell/currentprice/' + provider);
      if (res2.pfwresponse.status_code === 200) {

        result2 = res2.pfwresponse.result;
      } else {
        this.setState({
          error: true,
          errorMessage: res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
            'Something went wrong'
        });
      }

      const res3 = await Api.get('/api/gold/report/orders/' + provider + '?order_type=all');
      if (res3.pfwresponse.status_code === 200) {

        result3 = res3.pfwresponse.result;
      } else {
        this.setState({
          error: true,
          errorMessage: res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
            'Something went wrong'
        });
      }


      this.setProviderData(provider, result1, result2, result3);

    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast('Something went wrong', 'error');
    }
  }

  async componentDidMount() {

    this.onloadProvider('mmtc');
    this.onloadProvider('safegold');
  }



  sendEvents(user_action, product_name) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Gold Locker',
        "trade": this.state.value === 0 ? 'sell' : 'delivery',
        "amount": this.state.amountError ? 'invalid' : this.state.amount ? 'valid' : 'empty',
        "weight": this.state.weightError ? 'invalid' : this.state.weight ? 'valid' : 'empty',
        "product_name": product_name
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  statusMapper(data) {
    console.log(data);
    let cssMapper = {
      'init': {
        color: 'yellow',
        disc: 'Pending'
      },
      'success': {
        color: 'green',
        disc: 'Success'
      },
      'failed': {
        color: 'red',
        disc: 'Failed'
      },
      'rejected': {
        color: 'red',
        disc: 'Rejected'
      },
      'cancelled': {
        color: 'red',
        disc: 'Cancelled'
      }
    }


    let obj = cssMapper[data.status] || cssMapper['init'];


    let type = data.transaction_type;
    let title = '';
    if(type === 'buy') {
      title = 'Bought ' + data.order_details.gold_weight + ' gms'; 
    }

    if(type === 'sell') {
      title = 'Sold ' + data.order_details.gold_weight + ' gms'; 
    }

    if(type === 'delivery') {
      title = 'Delivery of ' + data.order_details.description; 
    }

    obj.title = title;

    return obj;
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  chooseTabs(provider) {
    this.setState({
      provider: provider,
      selected_provider_info: this.state[provider + '_info'],
      nextPage: '',
      loading_more: false
    })
  }

  loadMore = async () => {
    try {

      if (this.state.loading_more) {
        return;
      }
      this.setState({
        loading_more: true
      });

      let res = await Api.get(this.state.nextPage)

      this.setState({
        loading_more: false
      });

      if (res.pfwresponse.status_code === 200) {
        var policyData = res.pfwresponse.result.response;
        var next_page = policyData.group_insurance.next_page;
        var has_more = policyData.group_insurance.more;

        this.setState({
          nextPage: (has_more) ? next_page : null
        });

        var newReportData = [];

        this.setState((prevState) => ({
          reportData: prevState.reportData.concat(newReportData)
        }));
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        loading_more: false
      });
      toast('Something went wrong');
    }
  }

  hasReachedBottom() {
    var el = document.getElementsByClassName('Container')[0];
    var height = el.getBoundingClientRect().bottom <= window.innerHeight;
    return height;
  }

  onScroll = () => {
    if (this.hasReachedBottom()) {
      if (this.state.nextPage) {
        this.loadMore();
      }

    }
  };

  renderReportCards = (props, index) => {
    return (
      <div onClick={() => this.redirectCards(props)}
        key={index} style={{ cursor: 'pointer' }} className="card gold-trans-card">
        <div className="top-title">
          {props.cssMapper.title}
        </div>
        <div className={`report-color-state ${(props.cssMapper.color)}`}>
          <div className="circle"></div>
          <div className="report-color-state-title">{(props.cssMapper.disc)}</div>
        </div>
        <div className="report-ins-name">{props.product_name}</div>
        <div className="report-cover">
          <div className="report-cover-amount">
            <img
              src={require(`assets/${this.state.productName}/sip_date_icon.svg`)} alt="Gold" />
            <span style={{ color: '#767E86' }}>{props.dt_created}</span>
          </div>
          <div className="report-cover-amount">
            <img
              src={require(`assets/${this.state.productName}/amount_icon.svg`)} alt="Gold" />
            {inrFormatDecimal2(props.order_details.total_amount)}
          </div>
        </div>
      </div>
    )
  }

  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold locker"
        noFooter={true}
        events={this.sendEvents('just_set_events')}
      >
        <div className="my-gold-locker-home">
          <div
            style={{ marginTop: '15px', display: 'flex' }} className="highlight-text highlight-color-info">

            <img
              src={require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
            <div style={{ display: 'grid' }}>
              <div className="highlight-text12">
                Total value
              </div>
              <div className="highlight-text2" style={{ margin: '4px 0 0 8px' }}>
                {this.state.user_info.total_balance} gms = {inrFormatDecimal2(parseFloat(this.state.mmtc_info.sell_value) + parseFloat(this.state.safegold_info.sell_value))}
              </div>
            </div>

          </div>

          <div className="gold-locker-tabs">
            <div onClick={() => this.chooseTabs('mmtc')}
              className={`gold-locker-tab ${this.state.provider === 'mmtc' ? 'selected' : ''}`}>
              <div className="block1">
                <div className="title">
                  MMTC
              </div>
                <div className="block2">
                  {this.state.mmtc_info.gold_balance} gms
              </div>
                <div className="block2">
                  {inrFormatDecimal2(this.state.mmtc_info.sell_value)}
                </div>
              </div>

              {this.state.provider === 'mmtc' &&
                <img className="img"
                  src={require(`assets/${this.state.mmtc_info_local.logo}`)} alt="Gold" />}

            </div>
            <div onClick={() => this.chooseTabs('safegold')}
              className={`gold-locker-tab ${this.state.provider === 'safegold' ? 'selected' : ''}`}>
              <div className="block1">
                <div className="title">
                  Safegold
                </div>

                <div className="block2">
                  {this.state.safegold_info.gold_balance} gms
                </div>
                <div className="block2">
                  {inrFormatDecimal2(this.state.safegold_info.sell_value)}
                </div>
              </div>

              {this.state.provider === 'safegold' &&
                <img className="img"
                  src={require(`assets/${this.state.safegold_info_local.logo}`)} alt="Gold" />}

            </div>
          </div>

          {this.state.selected_provider_info.isRegistered &&
            <div>
              <div className="generic-page-title">
                Transactions
            </div>

              <div style={{ margin: '20px 0 0 0' }}>
                {this.state.selected_provider_info.reportData.map(this.renderReportCards)}
                {this.state.loading_more && <div className="loader">
                  Loading...
              </div>}
              </div>

              <div className="share-pan-bank">
                <div className="title">
                  Share PAN and Bank details to sell gold effortlessly
              </div>
                <img className="icon"
                  src={require(`assets/${this.state.productName}/ic_to_sell_gold.svg`)} alt="" />
              </div>
            </div>
          }
          {!this.state.selected_provider_info.isRegistered &&
            <div>
              <div>
                <img className="img"
                  src={require(`assets/${this.state.productName}/ils_alternate_assets.svg`)} alt="Gold" />
              </div>
              <div style={{ color: '#0A1D32', fontSize: 14, fontWeight: 400, margin: '20px 0 30px 0' }}>
                Seems like you have not invested in Safegold yet, <b>buy 24K gold</b> to create long term wealth.
            </div>
            </div>
          }

          <GoldBottomSecureInfo />

        </div>
      </Container>
    );
  }
}

export default GoldLocker;
