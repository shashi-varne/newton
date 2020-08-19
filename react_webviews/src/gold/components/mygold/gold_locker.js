import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';
import toast from '../../../common/ui/Toast';
import {
  inrFormatDecimal2, storageService, formatDateAmPm
} from 'utils/validators';

import { isUserRegistered, gold_providers, getTransactionStatus, 
  getUniversalTransStatus, gold_providers_array, default_provider } from '../../constants';

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
      provider: storageService().get('gold_provider') || default_provider,
      productName: getConfig().productName,
      mmtc_info: {},
      mmtc_info_local: gold_providers['mmtc'],
      safegold_info: {},
      safegold_info_local: gold_providers['safegold'],
      selected_provider_info: {
        local: {}
      }
    }
  }


  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  setCssMapper = (data) => {
    for (var i=0; i< data.length; i++) {
      data[i].order_details.orderType = data[i].transaction_type;
      data[i].order_details.final_status = getTransactionStatus(data[i].order_details);
      data[i].cssMapper = this.statusMapper(data[i]);
    }

    return data;
  }

  setProviderData(provider, result1, result2, result3) {
    let isRegistered = isUserRegistered(result1);
    let data = result1.gold_user_info.provider_info || {};
    data.isRegistered = isRegistered;
    data.user_info = result1.gold_user_info.user_info || {};
    data.sell_value = ((result2.sell_info.plutus_rate) * (data.gold_balance || 0)).toFixed(2) || 0;
    data.provider = provider;
    data.local = gold_providers[provider];

    let report = {
      orders: result3.orders ? result3.orders.all : [],
      next_page: result3.orders.next_page || ''
    };
    data.report = report;
    data.report.orders = this.setCssMapper(data.report.orders);

    if(data.user_info.total_balance) {
      this.setState({
        user_info: data.user_info
      });
    }
    this.setState({
      [provider + '_info']: data
    });


    if(provider === this.state.provider) {
      this.chooseTabs(this.state.provider);
    }
  }

  async onloadProvider(provider) {
    try {

      let result1 = {};
      let result2 = {};
      let result3 = {};
      const res = await Api.get('/api/gold/user/account/' + provider + '?bank_info_required=true');
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
      console.log(err);
      this.setState({
        show_loader: false,
      });
      toast('Something went wrong');
    }
  }

  async componentDidMount() {

    storageService().remove('forceBackState');
    this.onloadProvider('mmtc');
    this.onloadProvider('safegold');
    window.addEventListener("scroll", this.onScroll, false);
  }



  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'gold_locker',
        "provider_selected": this.state.provider,
        "total_balance": this.state.selected_provider_info.gold_balance
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  statusMapper(data) {
    let cssMapper = {
      'pending': {
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
      }
    }

    let type = data.transaction_type;
    
    let uniStatus = getUniversalTransStatus(data.order_details);
    let obj = cssMapper[uniStatus];

    
    let title = '';
    if(type === 'buy') {
      title = 'Bought ' + data.order_details.gold_weight + ' gms'; 
    }

    if(type === 'sell') {
      title = 'Sold ' + data.order_details.gold_weight + ' gms'; 
    }

    if(type === 'delivery') {
      title = 'Delivery of ' + (data.order_details.description || ''); 
    }

    obj.title = title;

    return obj;
  }

  navigate = (pathname, data = {}) => {
    let searchParams = getConfig().searchParams;

    if(data.pan_bank_flow) {
      searchParams += '&pan_bank_flow=' + data.pan_bank_flow
    }
    this.props.history.push({
      pathname: pathname,
      search: searchParams
    });
  }

  chooseTabs(provider) {

    this.setState({
      provider: provider,
    })

    let selected_provider_info = this.state[provider + '_info'];
    this.setState({
      selected_provider_info: selected_provider_info,
      next_page: selected_provider_info.report ? selected_provider_info.report.next_page : '',
      loading_more: false,
      show_loader: false
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

      let res = await Api.get(this.state.next_page)

      this.setState({
        loading_more: false
      });

      if (res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        var next_page = result.orders.next_page || '';

        let provider_info = this.state[this.state.provider + '_info'];
        provider_info.report.next_page = next_page;
        this.setState({
          next_page: next_page,
          [this.state.provider + '_info'] : provider_info
        });

        var newReportData = result.orders.all || [];
        let selected_provider_info  = this.state.selected_provider_info;
        let orders  = selected_provider_info.report.orders;
        newReportData = this.setCssMapper(newReportData);

        orders = orders.concat(newReportData);
        selected_provider_info.report.orders = orders;

        this.setState({
          selected_provider_info: selected_provider_info
        });

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      console.log(err);
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
      if (this.state.next_page) {
        // this.loadMore();
      }

    }
  };

  redirectCards = (data) => {

    this.sendEvents('trans_card');
    let pathname = this.state.selected_provider_info.provider + '/' + data.transaction_type + 
                    '/transaction/' + data.order_details.provider_txn_id;
    this.navigate(pathname);
  }

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
        <div className="report-cover">
          <div className="report-cover-amount">
            <img
              src={require(`assets/${this.state.productName}/sip_date_icon.svg`)} alt="Gold" />
            <span style={{ color: '#767E86',fontWeight: 'unset' }}>{formatDateAmPm(props.order_details.dt_created)}</span>
          </div>
          <div className="report-cover-amount">
            <img
              src={require(`assets/${this.state.productName}/amount_icon.svg`)} alt="Gold" />
            {inrFormatDecimal2(props.order_details.total_amount || 
              props.order_details.delivery_minting_cost)}
          </div>
        </div>
      </div>
    )
  }

  handlePanBank() {
    if(!this.state.selected_provider_info.user_info.pan_number) {
      this.navigate(
        this.state.provider + '/sell-pan', {pan_bank_flow: true}
      )
    } else {
      this.navigate(
        this.state.provider + '/sell-add-bank', {pan_bank_flow: true}
      )
    }
  }

  renderProviders = (props, index) => {
    let isSelected = this.state.provider === props.key;
    let key = props.key;
    return(
      <div key={index} onClick={() => this.chooseTabs(props.key)}
              className={`gold-locker-tab ${isSelected ? 'selected' : ''}`}>
              <div className="block1">
                <div className="title">
                  {this.state[key + '_info_local'].title}
              </div>
                <div className="block2">
                  {this.state[key + '_info'].gold_balance} gms
              </div>
                <div className="block2">
                  {inrFormatDecimal2(this.state[key + '_info'].sell_value)}
                </div>
              </div>

              {isSelected &&
                <img className="img"
                  src={require(`assets/${this.state[key + '_info_local'].logo}`)} alt="Gold" />}

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
        <div className="gold-locker-home">
          <div
            style={{ marginTop: '15px', display: 'flex' }} className="highlight-text highlight-color-info">

            <img
              src={require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
            <div style={{ display: 'grid', margin: '0 0 0 10px' }}>
              <div className="highlight-text12">
                Your gold locker
                <img  style={{margin: '0 0 0 8px', width: 11}}
                src={ require(`assets/lock_icn.svg`)} alt="Gold" />
              </div>
              <div className="highlight-text2" style={{ margin: '4px 0 0 8px' }}>
                {this.state.user_info.total_balance || 0} gms = {inrFormatDecimal2(parseFloat(this.state.mmtc_info.sell_value) + parseFloat(this.state.safegold_info.sell_value))}
              </div>
            </div>

          </div>

          <div className="gold-locker-tabs">
            {gold_providers_array.map(this.renderProviders)}
          </div>

          {this.state.selected_provider_info.isRegistered && this.state.selected_provider_info.gold_balance > 0 &&
            <div>
              <div className="generic-page-title">
                Transactions
            </div>

              <div style={{ margin: '20px 0 0 0' }}>
                {this.state.selected_provider_info.report.orders.map(this.renderReportCards)}
                {this.state.next_page && !this.state.loading_more && 
                  <div className="show-more" onClick={() => this.loadMore()}>
                    SHOW MORE
                  </div>
                }
                {this.state.loading_more && <div className="loader">
                  Loading...
              </div>}
              </div>

              {(!this.state.selected_provider_info.user_info.bank_info_added || 
              !this.state.selected_provider_info.user_info.pan_number) &&
               <div className="share-pan-bank" onClick={() => this.handlePanBank()}>
                  <div className="title">
                    Share PAN and Bank details to sell gold effortlessly
                </div>
                  <img className="icon"
                    src={require(`assets/${this.state.productName}/ic_to_sell_gold.svg`)} alt="" />
                </div>
              }
            </div>
          }
          {(!this.state.selected_provider_info.isRegistered || this.state.selected_provider_info.gold_balance <= 0 || 
          !this.state.selected_provider_info.gold_balance) &&
            <div>
              <div>
                <img className="img"
                 style={{width: '100%'}}
                  src={require(`assets/${this.state.productName}/ils_alternate_assets.svg`)} alt="Gold" />
              </div>
              {this.state.selected_provider_info.local &&
              <div style={{ color: '#0A1D32', fontSize: 14, fontWeight: 400, margin: '20px 0 30px 0',
            lineHeight: 1.6 }}>
                Seems like you have not invested in {this.state.selected_provider_info.local.title} yet, <b>buy 24K gold</b> to create long term wealth.
            </div>}
            </div>
          }

          <GoldBottomSecureInfo parent={this} />

        </div>
      </Container>
    );
  }
}

export default GoldLocker;
