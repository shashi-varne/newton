import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import sip_resumed_fisdom from 'assets/ils_esign_failed_fisdom.svg';
import sip_resumed_myway from 'assets/ils_esign_failed_myway.svg';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig, getBasePath } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { inrFormatDecimal } from '../../../utils/validators';
import ContactUs from '../../../common/components/contact_us';

class EnpsSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      sip_resumed: getConfig().productName !== 'fisdom' ? sip_resumed_myway : sip_resumed_fisdom,
      highlight_text: getConfig().productName !== 'fisdom' ? 'highlight-text-myway' : 'highlight-text',
      pc_urlsafe: getConfig().pc_urlsafe,
      orderdata: {},
    }
  }

  async componentDidMount() {

    this.setState({
      show_loader: true
    })
    try {
      const res = await Api.get('/api/nps/invest/last/order/' + this.state.pc_urlsafe);
      this.setState({
        show_loader: false
      })

      if (res.pfwresponse.result && !res.pfwresponse.result.error) {
        let result = res.pfwresponse.result;
        this.setState({
          orderdata: result.orders[0]
        })
      } else {
        toast(res.pfwresponse.result.error ||
          res.pfwresponse.result.message || 'Something went wrong', 'error');
      }


    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }
  }

  handleClick = () => {
    this.sendEvents('retry');
    let redirect_url = getConfig().redirect_url;
    let basepath = getBasePath()
    let current_url = basepath + '/e-mandate/enps/redirection' + getConfig().searchParams;
    var pgLink = getConfig().base_url + '/page/nps/user/esign/' + this.state.pc_urlsafe;
    if (!redirect_url) {
      if (getConfig().app === 'ios') {
        nativeCallback({
          action: 'show_top_bar', message: {
            title: 'Authorisation'
          }
        });
      }
      nativeCallback({
        action: 'take_control', message: {
          back_url: current_url,
          back_text: 'You are almost there, do you really want to go back?'
        }
      });
    } else {
      let redirectData = {
        show_toolbar: false,
        icon: 'back',
        dialog: {
          message: 'Are you sure you want to exit?',
          action: [{
            action_name: 'positive',
            action_text: 'Yes',
            action_type: 'redirect',
            redirect_url: current_url
          }, {
            action_name: 'negative',
            action_text: 'No',
            action_type: 'cancel',
            redirect_url: ''
          }]
        },
        data: {
          type: 'webview'
        }
      };
      if (getConfig().app === 'ios') {
        redirectData.show_toolbar = true;
      }
      nativeCallback({
        action: 'third_party_redirect', message: redirectData
      });
    }
    window.location.href = pgLink;
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'enps',
      "properties": {
        "user_action": user_action,
        "screen_name": 'auth_success'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={true}
        buttonTitle="RETRY E-SIGN"
      >
        <div>
          <div className="main-top-title-new">NPS with e-Sign failed</div>
          <div className="success-img">
            <img alt="Mandate" src={this.state.sip_resumed} width="100%" />
          </div>
          <div className="success-text-info success-enps">
            e-Sign by Aadhaar has been failed, retry e-Sign to complete your NPS contribution.
          </div>
          {this.state.orderdata && this.state.orderdata.total_amount &&
            <div style={{ display: 'flex' }} className={`${this.state.highlight_text}`}>
              <div><img width="30" src={this.state.orderdata.fund_transactions[0].pf.pf_house.image} alt="NPS Fund House" /></div>
              <div style={{ marginLeft: '20px', lineHeight: '20px' }}>
                <div>
                  {this.state.orderdata.fund_transactions[0].pf.pension_house_name}
                </div>
                <div style={{ marginTop: '5px' }}>
                  {inrFormatDecimal(this.state.orderdata.total_amount)}
                </div>
              </div>
            </div>
          }

          <ContactUs />
        </div>
      </Container >
    );
  }
}


export default EnpsSuccess;
