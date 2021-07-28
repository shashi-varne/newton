import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import sip_resumed_fisdom from 'assets/ils_esign_success_fisdom.svg';
import sip_resumed_myway from 'assets/finity/ils_esign_success_myway.svg';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { nativeCallback, openModule } from 'utils/native_callback';
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
      session_less_enps: window.sessionStorage.getItem('session_less_enps') || '',
      pc_urlsafe: getConfig().pc_urlsafe,
      orderdata: {},
      type: getConfig().productName
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
    this.sendEvents('ok');
    openModule('app/portfolio', this.props);
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
        buttonTitle="GO TO PORTFOLIO"
        noFooter={this.state.session_less_enps}
        noBack={this.state.session_less_enps}
      >
        <div>
          <div className="main-top-title-new">NPS with e-Sign successful</div>
          <div className="success-img">
            <img alt="Mandate" src={this.state.sip_resumed} width="100%" />
          </div>
          <div className="success-text-info success-enps">
            e-Sign by Aadhaar is successful. You will receive a confirmation mail from PFRDA and your PRAN card will be delivered within a week at registered address.
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
