import React, { Component } from 'react';
import qs from 'qs';

import info_icon_fisdom from 'assets/info_icon_fisdom.svg'
import info_icon_myway from 'assets/info_icon_myway.svg'
import Container from '../../common/Container';
import { getConfig, getBasePath } from 'utils/functions';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import top_icon_fisdom from 'assets/esign_intro_illustration_fisdom.svg';
import top_icon_myway from 'assets/esign_intro_illustration_myway.svg';
import ic_i_myway from 'assets/ic_input_myway.svg';
import ic_a_myway from 'assets/ic_esign_otp_myway.svg';
import ic_otp_myway from 'assets/ic_verify_otp_myway.svg';
import ic_e_myway from 'assets/ic_esign_done_myway.svg';
import ic_i_fisdom from 'assets/ic_input_fisdom.svg';
import ic_a_fisdom from 'assets/ic_esign_otp_fisdom.svg';
import ic_otp_fisdom from 'assets/ic_verify_otp_fisdom.svg';
import ic_e_fisdom from 'assets/ic_esign_done_fisdom.svg';


import { nativeCallback } from 'utils/native_callback';
import {open_browser_web} from  'utils/validators';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';

const aboutQuestions = [
  {
    id: 1,
    question: 'What is e-Sign?',
    answer: 'e-Sign service is an online electronic signature service that can facilitate an Aadhaar holder to digitally sign your NPS Application. It removes the requirement to physically sign any documents and hence is completely paperless and secure.'
  },
  {
    id: 2,
    question: 'How Secure is e-Sign?',
    answer: 'NSDL e-Governance Infrastructure Limited (NSDL e-Gov), a licensed Certifying Authority (CA), is empanelled by Controller of Certifying Authorities (CCA) to provide e-Sign Services to Application Service Providers (ASPs). It is completely secure and authorized by UIDAI.'
  }
]

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      questionIndex: 0,
      faq_read: "no",
      info_icon: getConfig().productName !== 'fisdom' ? info_icon_myway : info_icon_fisdom,
      top_icon: getConfig().productName !== 'fisdom' ? top_icon_myway : top_icon_fisdom,
      a_icon: getConfig().productName !== 'fisdom' ? ic_a_myway : ic_a_fisdom,
      e_icon: getConfig().productName !== 'fisdom' ? ic_e_myway : ic_e_fisdom,
      i_icon: getConfig().productName !== 'fisdom' ? ic_i_myway : ic_i_fisdom,
      otp_icon: getConfig().productName !== 'fisdom' ? ic_otp_myway : ic_otp_fisdom,
      emandate: {},
      pc_urlsafe: getConfig().pc_urlsafe,
      biller_bank: {}
    }

    this.renderQuestions = this.renderQuestions.bind(this);
  }
  componentWillMount() {
    if (!this.state.params.referral_code) {
      window.sessionStorage.setItem('session_less_enps', '');
    }

    const emandate_easysip = [
      {
        'disc': 'Request OTP on registered mobile on KARVY platform',
        'icon': this.state.otp_icon
      },
      {
        'disc': 'Enter OTP to verify details and start Aadhaar verification',
        'icon': this.state.a_icon
      },
      {
        'disc': 'Enter Aadhaar number and OTP received on mobile linked to your Aadhaar',
        'icon': this.state.i_icon
      },
      {
        'disc': 'e-Sign done, PRAN will get activated in 3 business days',
        'icon': this.state.e_icon
      }
    ]
    this.setState({
      emandate: emandate_easysip,
      referral_code: this.state.params.referral_code
    })
  }

  async componentDidMount() {
    this.setState({
      show_loader: false
    })
  }

  navigate = (pathname, data) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      state: data
    });
  }

  renderSteps = (props, index) => {
    return (
      <div key={index} className="plan-details-item">
        <img className="plan-details-icon" src={props.icon} alt="" />
        <div className="plan-details-text"> {index + 1}. {props.disc}</div>
      </div>
    )
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'enps',
      "properties": {
        "user_action": user_action,
        "faq_read": this.state.faq_read,
        "screen_name": 'set_up_enps'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next');
    if (this.state.referral_code) {

      let data = {
        referral_code: this.state.referral_code
      }
      this.navigate('otp', data);
      return;

    }
    let basepath = getBasePath()
    let current_url = basepath + '/e-mandate/enps/redirection' + getConfig().searchParams;
    var pgLink = getConfig().base_url + '/page/nps/user/esign/' + this.state.pc_urlsafe;
    if (getConfig().isNative) {
      if (getConfig().app === 'ios') {
        nativeCallback({
          action: 'show_top_bar', message: {
            title: 'Activate NPS'
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

    // for web, we will open in new tab
    if(getConfig().Web) {

      this.setState({
        show_loader: true
      })
      try {
          const res = await Api.get('/api/nps/esign/status/' + this.state.pc_urlsafe);
          this.setState({
              show_loader: false
          })

          if (res.pfwresponse.result && !res.pfwresponse.result.error) {
              let result = res.pfwresponse.result;

              if (result.esign === true) {
                  this.navigate('success');
              } else {
                open_browser_web(pgLink, '_blank');
              }
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
      
    } else {
      window.location.href = pgLink;
    }

  }

  showAnswers(index) {
    if (this.state.questionIndex === index) {
      this.setState({
        questionIndex: -1,
        faq_read: "yes"
      })
    } else {
      this.setState({
        questionIndex: index,
        faq_read: "yes"
      })
    }
  }

  renderQuestions(props, index) {
    return (
      <div style={{ marginTop: 26, marginBottom: 25 }} key={index}>
        <div style={{ display: '-webkit-box' }} onClick={() => this.showAnswers(index)}>
          <img
            src={this.state.questionIndex === index ? shrink : expand} style={{ verticalAlign: 'bottom' }} width={14} alt="OTM" />
          <div style={{
            color: '#0a1d32', margin: '0 0 0 7px',
            fontSize: 16
          }}>{props.question}</div>
        </div>
        {this.state.questionIndex === index &&
          <div style={{ fontSize: 15, color: '#767e86', margin: '10px 0  0 21px' }}>
            {props.answer}
          </div>}
      </div>

    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        edit={this.props.edit}
        disableBack={true}
        buttonTitle="Continue to e-Sign"
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ color: '#0A1C32', fontWeight: 500, fontSize: 20, margin: '0 0 10px 0' }}>
          Activate NPS with e-Sign
        </div>
        <div style={{ textAlign: 'center' }}>
          <img width={'100%'} src={this.state.top_icon} alt="Mandate" />
        </div>
        <div style={{
          color: '#767e86', margin: '10px 0px 10px 0px',
          fontSize: 16
        }}>
          e-Sign for NPS is an online electronic signature service that can facilitate opening of your NPS account securely and completely paperless.
        </div>
        <div style={{ marginTop: '40px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>How to activate NPS with e-Sign</div>

          {this.state.emandate.map(this.renderSteps)}
        </div>
        {aboutQuestions.map(this.renderQuestions)}

      </Container>

    );
  }
}
export default About;