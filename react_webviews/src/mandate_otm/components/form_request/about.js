import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import { nativeCallback } from 'utils/native_callback';

const aboutQuestions = [
  {
    id: 1,
    question: 'What is bank mandate(OTM)?',
    answer: 'A Bank Mandate is your authorization to a third party (e.g BSE) to debit a specific sum from bank account at a regular interval.'
  },
  {
    id: 2,
    question: 'How to create Bank mandate(OTM)?',
    answer: 'A Bank Mandate(OTM) is your authorization given to a third party (e.g BSE) to debit a specific sum from bank account at a regular interval.'
  },
  {
    id: 3,
    question: 'What is the default OTM amount?',
    answer: 'It will be Rs. 50,000. But only the amount limited to your monthly SIP value be will be auto debited.'
  },
  {
    id: 4,
    question: 'Why Rs. 50000 and not the exact SIP amount?',
    answer: 'To make your future SIPs hassle-free. Incase you start additional SIP in future, same OTM can be reused for the new one too.'
  }
]

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      questionIndex: -1,
      productName: getConfig().productName
    }

    this.renderQuestions = this.renderQuestions.bind(this);
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Address',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Intro'
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
    this.navigate('address');
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
            color: '#878787', margin: '0 0 0 7px',
            fontSize: 16, fontWeight: 'bold'
          }}>{props.question}</div>
        </div>
        {this.state.questionIndex === index && props.id !== 2 &&
          <div style={{ fontSize: 15, color: '#878787', margin: '10px 0  0 21px' }}>
            {props.answer}
          </div>}
        {this.state.questionIndex === index && props.id === 2 &&
          <div style={{
            fontSize: 15, color: '#878787',
            margin: '10px 0  0 21px', display: 'grid'
          }}>
            <span style={{ marginBottom: 8 }}><span style={{ fontWeight: 700 }}>1:</span> Share your <span style={{ fontWeight: 700 }}>bank</span> and <span style={{ fontWeight: 700 }}>address</span> details.</span>
            <span style={{ marginBottom: 8 }}><span style={{ fontWeight: 700 }}>2:</span> Check your email for the Bank Mandate form in few hours.</span>
            <span style={{ marginBottom: 8 }}><span style={{ fontWeight: 700 }}>3:</span> Download form, put your signature and upload it from <span style={{ fontWeight: 700 }}>Notification</span> center</span>
          </div>}
      </div>

    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="More About OTM"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Continue"
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ textAlign: 'center' }}>
          <img width={100} src={require(`assets/${this.state.productName}/mandate_pending_icon.svg`)} alt="OTM" />
        </div>
        <div style={{
          color: getConfig().styles.default, margin: '10px 0px 10px 0px',
          fontSize: 16, textAlign: 'center'
        }}>
          One Time Bank Mandate (OTM) automates monthly debits from your bank account for monthly SIP payments. Check below for more information
        </div>
        {aboutQuestions.map(this.renderQuestions)}

      </Container>

    );
  }
}

export default About;
