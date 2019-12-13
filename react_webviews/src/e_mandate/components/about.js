import React, { Component } from 'react';
import qs from 'qs';

import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import top_icon_fisdom from 'assets/sip_action_illustration_fisdom.svg';
import top_icon_myway from 'assets/sip_action_illustration_myway.svg';
import ic_b_myway from 'assets/ic_auth_bank_myway.svg';
import ic_e_myway from 'assets/ic_auth_emandate_myway.svg';
import ic_sb_myway from 'assets/ic_select_bank_myway.svg';
import ic_b_fisdom from 'assets/ic_auth_bank_fisdom.svg';
import ic_e_fisdom from 'assets/ic_auth_emandate_fisdom.svg';
import ic_sb_fisdom from 'assets/ic_select_bank_fisdom.svg';
import trust_icon from 'assets/trust_icons_emandate.svg';

import toast from '../../common/ui/Toast';
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
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      questionIndex: -1,
      top_icon: getConfig().productName !== 'fisdom' ? top_icon_myway : top_icon_fisdom,
      b_icon: getConfig().productName !== 'fisdom' ? ic_b_myway : ic_b_fisdom,
      e_icon: getConfig().productName !== 'fisdom' ? ic_e_myway : ic_e_fisdom,
      sb_icon: getConfig().productName !== 'fisdom' ? ic_sb_myway : ic_sb_fisdom,
      emandate: {}
    }

    this.renderQuestions = this.renderQuestions.bind(this);
  }
  componentWillMount() {
    const emandate_easysip = [
      {
        'disc': 'Select bank account from which you want funds to be debited',
        'icon': this.state.b_icon
      },
      {
        'disc': 'You will then be redirected to e-mandate approval gateway',
        'icon': this.state.e_icon
      },
      {
        'disc': 'Authorise e-mandate request either by Net Banking/Debit Card',
        'icon': this.state.sb_icon
      }
    ]
    this.setState({
      emandate: emandate_easysip
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
        <div className="plan-details-text">{props.disc}</div>
      </div>
    )
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'e-mandate',
      "properties": {
        "user_action": user_action,
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
    try {
      const res = await Api.get('/api/mandate/enach/user/banks');
      if (res.pfwresponse.result) {
        let params = {
          banks: res.pfwresponse.result.banks
        }
        this.navigate('e-mandate/select-bank', params);
      }
      else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }


    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }
  }

  showAnswers(index) {
    if (this.state.questionIndex === index) {
      this.setState({
        questionIndex: -1
      })
    } else {
      this.setState({
        questionIndex: index
      })
    }
  }

  renderQuestions(props, index) {
    return (
      <div style={{ marginTop: 26, marginBottom: 5 }} key={index}>
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
        title="Set up easySIP"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Select Bank for e-mandate"
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ textAlign: 'center' }}>
          <img width={'100%'} src={this.state.top_icon} alt="Mandate" />
        </div>
        <div style={{
          color: '#767e86', margin: '10px 0px 10px 0px',
          fontSize: 16
        }}>
          easySIP with e-mandate makes your monthly SIP payments simpler and secure. It's a one time online authorization process to fund your monthly SIP.
        </div>
        <div style={{ marginTop: '40px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>How to set up easySIP with e-Mandate</div>

          {this.state.emandate.map(this.renderSteps)}
        </div>
        {aboutQuestions.map(this.renderQuestions)}
        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <div style={{ color: '#636363', marginBottom: '10px' }}>e-mandate powered by</div>
          <img width={'75%'} src={trust_icon} alt="NACH" />
        </div>

      </Container>

    );
  }
}

export default About;
