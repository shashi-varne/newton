import React, { Component } from 'react';
import qs from 'qs';

import info_icon_fisdom from 'assets/info_icon_fisdom.svg'
import info_icon_myway from 'assets/finity/info_icon_myway.svg'
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import top_icon_fisdom from 'assets/sip_action_illustration_fisdom.svg';
import top_icon_myway from 'assets/finity/sip_action_illustration_myway.svg';
import ic_b_myway from 'assets/finity/ic_auth_bank_myway.svg';
import ic_e_myway from 'assets/finity/ic_esign_otp_finity.svg';
import ic_sb_myway from 'assets/ic_select_bank_myway.svg';
import ic_b_fisdom from 'assets/ic_auth_bank_fisdom.svg';
import ic_e_fisdom from 'assets/ic_auth_emandate_fisdom.svg';
import ic_sb_fisdom from 'assets/ic_select_bank_fisdom.svg';

import toast from '../../../common/ui/Toast';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';

const aboutQuestions = [
  {
    id: 1,
    question: 'What is easySIP?',
    answer: 'To put it simply, easySIP is the name we have given to the payment method you use to pay for your monthly SIP payments. It is just an evolved version of the post-dated cheques that you must have used to make automatic SIP payments. It is completely paperless and secured by NPCI which is the PSU behind Rupay and UPI.'
  },
  {
    id: 2,
    question: 'Why do I need to give authorization to take money from my bank account?',
    answer: 'Regular SIP payment is crucial to save for the future and easySIP ensures that you never miss your SIP payments. You can always skip, pause or cancel your SIPs as per your request. Once you authorise the request, we send it to your bank which verifies and approves it. On the date of SIP, we send the request to the bank to transfer your SIP amount to the Mutual Fund Company which then gets invested.'
  },
  {
    id: 3,
    question: 'Why is e-Mandate maximum amount 50,000/- when my SIP is of less amount?',
    answer: 'The Maximum Transaction Amount is the limit that you have authorized to debit from your bank account per day. The benefit of a higher limit is that you can start multiple SIPs without having to go through the process again. On any day, there will never be a debit of more than your total SIP amount.'
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
      b_icon: getConfig().productName !== 'fisdom' ? ic_b_myway : ic_b_fisdom,
      e_icon: getConfig().productName !== 'fisdom' ? ic_e_myway : ic_e_fisdom,
      sb_icon: getConfig().productName !== 'fisdom' ? ic_sb_myway : ic_sb_fisdom,
      emandate: {},
      pc_urlsafe: getConfig().pc_urlsafe,
      biller_bank: {},
      sip_total_amount: '',
      sip_dates: '',
      fetchError: ''
    }

    this.renderQuestions = this.renderQuestions.bind(this);
  }
  componentWillMount() {
    const emandate_easysip = [
      {
        'disc': 'Request OTP on your registered mobile number',
        'icon': this.state.b_icon
      },
      {
        'disc': 'Enter OTP to verify and activate easySIP',
        'icon': this.state.e_icon
      }
    ]
    this.setState({
      emandate: emandate_easysip
    })
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/mandate/auto/debit/biller/data/' + this.state.pc_urlsafe);
      if (res.pfwresponse.result && !res.pfwresponse.result.error) {
        let biller_bank = res.pfwresponse.result.biller_bank || {};
        let sip_total_amount = res.pfwresponse.result.total_sip_amount || '';
        let sip_dates = res.pfwresponse.result.sips_dates || '';
        this.setState({
          biller_bank: biller_bank,
          sip_total_amount: sip_total_amount,
          sip_dates: sip_dates,
          show_loader: false
        });

      }
      else {
        let fetchError = res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong';
        this.setState({
          fetchError: fetchError,
          show_loader: false
        })
      }


    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }

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
      "event_name": 'session_less_campaigns',
      "properties": {
        "user_action": user_action,
        "faq_read": this.state.faq_read,
        "mandate_type": 'biller',
        "screen_name": 'set_up_easy_sip'
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
    this.setState({
      show_loader: true
    })

    this.navigate('/e-mandate/consent/otp');

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
    if (this.state.fetchError) {
      return (
        <Container
          showLoader={this.state.show_loader}
          disableBack={true}
          noFooter={true}
          events={this.sendEvents('just_set_events')}
        >
          <div style={{ color: '#0A1C32', fontWeight: 500, fontSize: 20, margin: '0 0 10px 0' }}>
            Activate easySIP
          </div>
          <div style={{ textAlign: 'center' }}>
            <img width={'100%'} src={this.state.top_icon} alt="Mandate" />
          </div>
          <div style={{
            color: '#767e86', margin: '10px 0px 10px 0px',
            fontSize: 16
          }}>
            {this.state.fetchError}
          </div>
        </Container>
      )
    } else {
      return (
        <Container
          showLoader={this.state.show_loader}
          handleClick={this.handleClick}
          edit={this.props.edit}
          disableBack={true}
          buttonTitle="Request OTP"
          events={this.sendEvents('just_set_events')}
        >
          <div style={{ color: '#0A1C32', fontWeight: 500, fontSize: 20, margin: '0 0 10px 0' }}>
            Activate easySIP
        </div>
          <div style={{ textAlign: 'center' }}>
            <img width={'100%'} src={this.state.top_icon} alt="Mandate" />
          </div>
          <div style={{
            color: '#767e86', margin: '10px 0px 10px 0px',
            fontSize: 16
          }}>
            easySIP with <b>OTP consent</b> makes your monthly SIP payments simpler. It's a one time authorization process to fund your monthly SIP.
        </div>
          {!this.state.sip_total_amount && !this.state.sip_dates &&
            <div style={{ marginTop: '15px' }} className="highlight-text highlight-color-info">
              <div className="highlight-text1">
                <img className="highlight-text11" src={this.state.info_icon} alt="info" />
                <div className="highlight-text12">
                  Activate easySIP for
                </div>
              </div>
              <div className="highlight-text2">
                Bank A/C: {this.state.biller_bank.bank_short_name} - {this.state.biller_bank.obscured_account_number}
              </div>
            </div>
          }
          <div style={{ marginTop: '40px' }}>
            <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Steps to activate easySIP</div>

            {this.state.emandate.map(this.renderSteps)}
          </div>
          {this.state.sip_total_amount && this.state.sip_dates &&
            <div style={{ margin: '15px -15px' }}>
              <div className="sip-details-header">
                SIP details
            </div>
              <div>
                <div className="sip-details"><div className="left"><b>Total SIP amount</b> </div><div className="right"><b>₹{this.state.sip_total_amount}</b></div></div>
                <div className="sip-details"><div className="left">SIP date </div><div className="right">{this.state.sip_dates} of every month</div></div>
                <div className="sip-details"><div className="left">Mutual fund distributor </div><div className="right">Finwizard Technology pvt limited</div></div>
                <div className="sip-details"><div className="left">Bank </div><div className="right">{this.state.biller_bank.bank_short_name} bank</div></div>
                <div className="sip-details"><div className="left">A/C number </div><div className="right">{this.state.biller_bank.obscured_account_number}</div></div>
              </div>
            </div>
          }
          <div style={{ color: '#0A1C32', fontWeight: 500, fontSize: 20, margin: '0 0 10px 0' }}>
            Frequently asked questions
        </div>
          {aboutQuestions.map(this.renderQuestions)}

        </Container>

      )}
  }
}

export default About;
