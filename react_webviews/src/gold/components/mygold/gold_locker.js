import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';
import toast from '../../../common/ui/Toast';
import {
  inrFormatDecimalWithoutIcon
} from 'utils/validators';

class GoldLocker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      goldInfo: {},
      userInfo: {},
      goldSellInfo: {},
      isRegistered: false,
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      error: false,
      errorMessage: '',
      countdownInterval: null,
      provider: 'mmtc',
      productName: getConfig().productName,
      reportData: [],
    }
  }

 
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }


  async componentDidMount() {
    
    let obj = {
      'name': 'test test',
      'status': 'success'
    };
    obj.cssMapper = this.statusMapper(obj);

    let obj2 = {
      'name': 'test test',
      'status': 'failed'
    };
    obj2.cssMapper = this.statusMapper(obj2);

    let obj3 = {
      'name': 'test test',
      'status': 'pending'
    };
    obj3.cssMapper = this.statusMapper(obj3);

    let reportData = [obj, obj2, obj3, obj];

    this.setState({
      reportData: reportData
    })

    try {

      const res = await Api.get('/api/gold/user/account');
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        if (result.gold_user_info.user_info.registration_status === "pending" ||
          !result.gold_user_info.user_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: result.gold_user_info.user_info,
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
      }

      const res2 = await Api.get('/api/gold/sell/currentprice');
      if (res2.pfwresponse.status_code === 200) {
        let goldInfo = this.state.goldInfo;
        let result = res2.pfwresponse.result;
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo,
        });

      } else {
        this.setState({
          error: true,
          errorMessage: res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
            'Something went wrong'
        });
      }


   
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      // toast('Something went wrong', 'error');
    }

    this.setState({
      show_loader: false
    });
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
    let cssMapper = {
      'init' : {
        color: 'yellow',
        disc: 'Pending'
      },
      'success' : {
        color: 'green',
        disc: 'Success'
      },
      'failed' : {
        color: 'red',
        disc: 'Failed'
      },
      'rejected' : {
        color: 'red',
        disc: 'Rejected'
      },
      'cancelled' : {
        color: 'red',
        disc: 'Cancelled'
      }
    }
    
    return cssMapper[data.status] || cssMapper['init'];
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  chooseTabs(provider) {
    this.setState({
      provider: provider
    })
  }
  
  loadMore = async () => {
    try {

      if(this.state.loading_more) {
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
      if(this.state.nextPage) {
        this.loadMore();
      }
      
    }
  };

  renderReportCards = (props, index) => {
    return (
      <div onClick={() => this.redirectCards(props)} 
      key={index} style={{cursor:'pointer'}} className="card gold-trans-card">
        <div className="top-title">
          Bought 0.014 gms
        </div>
        <div className={`report-color-state ${(props.cssMapper.color)}`}>
          <div className="circle"></div>
          <div className="report-color-state-title">{(props.cssMapper.disc)}</div>
        </div>
        <div className="report-ins-name">{props.product_name}</div>
        <div className="report-cover">
          <div className="report-cover-amount">
              <img 
              src={ require(`assets/${this.state.productName}/sip_date_icon.svg`)} alt="Gold" />
              <span style={{color: '#767E86'}}>2nd Jan, 06:30 PM</span>
          </div>
          <div className="report-cover-amount">
            <img 
              src={ require(`assets/${this.state.productName}/amount_icon.svg`)} alt="Gold" />
            ₹{inrFormatDecimalWithoutIcon(2000)}
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
        <div style={{ marginTop: '15px',display:'flex' }} className="highlight-text highlight-color-info">

            <img 
              src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
            <div style={{display: 'grid'}}>
              <div className="highlight-text12">
              Total value
              </div>
              <div className="highlight-text2" style={{margin: '4px 0 0 8px'}}>
              0.0249 gms = ₹93.83
              </div>
            </div>
            
        </div>

        <div className="gold-locker-tabs">
          <div onClick={() => this.chooseTabs('mmtc')} 
          className={`gold-locker-tab ${this.state.provider === 'mmtc' ? 'selected': ''}`}>
            <div className="block1">
              <div className="title">
                MMTC
              </div>
              <img className="img"
              src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
            </div>
            <div className="block2">
              0.024 gms
            </div>
            <div className="block2">
              ₹93.83
            </div>
          </div>
          <div onClick={() => this.chooseTabs('safegold')} 
          className={`gold-locker-tab ${this.state.provider === 'safegold' ? 'selected': ''}`}>
              <div className="block1">
                <div className="title">
                  Safegold
                </div>
                <img className="img"
                src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
              </div>
              <div className="block2">
                0.024 gms
              </div>
              <div className="block2">
                ₹93.83
              </div>
          </div>
        </div>

        <div>
          <div className="generic-page-title">
            Transactions
          </div>

          <div style={{margin: '20px 0 0 0'}}>
            {this.state.reportData.map(this.renderReportCards)}
            {this.state.loading_more && <div className="loader">
              Loading...
            </div>}
          </div>
        </div>

        {/* <div>
          <div>
              <img className="img"
                src={ require(`assets/${this.state.productName}/ils_alternate_assets.svg`)} alt="Gold" />
          </div>
          <div style={{color: '#0A1D32', fontSize:14, fontWeight: 400, margin: '20px 0 30px 0'}}>
          Seems like you have not invested in Safegold yet, <b>buy 24K gold</b> to create long term wealth.
          </div>
        </div> */}
        <GoldBottomSecureInfo />
      </Container>
    );
  }
}

export default GoldLocker;
