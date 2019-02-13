import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import expand from 'assets/expand_icn.png';
import icon from 'assets/claim_settle_icn.png';
import shrink from 'assets/shrink_icn.png';

const aboutQuestions = [
  {
    id: 1,
    question: 'What is OTM',
    answer: 'A Bank Mandate(OTM) is your authorization given to a third party (e.g BSE) to debit a specific sum from bank account at a regular interval.'
  },
  {
    id: 2,
    question: 'What is OTM',
    answer: 'A Bank Mandate(OTM) is your authorization given to a third party (e.g BSE) to debit a specific sum from bank account at a regular interval.'
  },
  {
    id: 3,
    question: 'What is OTM',
    answer: 'A Bank Mandate(OTM) is your authorization given to a third party (e.g BSE) to debit a specific sum from bank account at a regular interval.'
  },
  {
    id: 4,
    question: 'What is OTM',
    answer: 'A Bank Mandate(OTM) is your authorization given to a third party (e.g BSE) to debit a specific sum from bank account at a regular interval.'
  }
]

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      questionIndex: 0
    }

    this.renderQuestions = this.renderQuestions.bind(this);
  }


  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.navigate('question1');
  }

  showAnswers(index) {
    if (this.state.questionIndex == index) {
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
      <div style={{ marginTop: 30 }} key={index}>
        <div style={{ display: '-webkit-box' }}>
          <img onClick={() => this.showAnswers(index)}
            src={this.state.questionIndex === index ? shrink : expand} style={{ verticalAlign: 'bottom' }} width={14} alt="OTM" />
          <div style={{
            color: '#878787', margin: '0 0 0 7px',
            fontSize: 16, fontWeight: 'bold'
          }}>{props.question}</div>
        </div>
        {this.state.questionIndex === index &&
          <div style={{ fontSize: 15, color: '#878787', margin: '10px 0  0 21px' }}>
            {props.answer}
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
        type={this.state.type}
      >
        <div style={{ textAlign: 'center' }}>
          <img src={icon} alt="OTM" />
        </div>
        <div style={{
          color: getConfig().default, margin: '10px 0px 10px 19px',
          fontSize: 16, textAlign: 'center'
        }}>
          One-time Bank Mandate (OTM) automates monthly debits from bank account to SIP
        </div>
        {aboutQuestions.map(this.renderQuestions)}

      </Container>

    );
  }
}

export default About;
