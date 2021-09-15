import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import process_success from 'assets/completed_step.svg';
import wait_icn from 'assets/not_done_yet_step.svg';
import in_process_icn from 'assets/current_step.svg';

import easy_secure_icon from 'assets/easy_secure_icon.svg';
import eta_icon from 'assets/eta_icon.png';

class JourneyIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentWillMount() {

    let journeyData = [
      {
        title: 'Step-1',
        disc: 'Share basic details and answer few questions to choose the right insurance',
        status: 'init'
      },
      {
        title: 'Step-2',
        disc: 'Complete Insurance Application',
        status: 'pending'
      },
      {
        title: 'Step-3',
        disc: 'Pay first premium',
        status: 'pending'
      },
      {
        title: 'Step-4',
        disc: 'Share relevant documents',
        status: 'pending'
      }
    ];
    this.setState({
      journeyData: journeyData
    })
  }

  async componentDidMount() {
    this.setState({
      show_loader: false,
    });
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    this.navigate('personal-details-intro')
  }

  renderJourney(props, index) {
    return (
      <div key={index} className={'journey-process2 ' + (props.status === 'complete' ? 'journey-process2-green' :
        ((props.title === 'Step-4' && props.status !== 'complete') ||
          (props.title === 'Step-5' && props.status === 'init')) ? 'journey-process2-unset' : '')}
        style={{ minHeight: 80 }}>
        <div className="journey-process3">
          <img className="journey-process4" src={props.status === 'complete' ? process_success :
            props.status === 'init' ? in_process_icn : wait_icn} alt="" />
        </div>
        <div className="journey-process5">
          <div className={'journey-process6 ' + (props.status === 'pending' ? 'journey-process7-grey' : '')}>{props.title}</div>
          <div className={'journey-process7 ' + (props.status === 'complete' ? 'journey-process7-black' : 'journey-process7-grey')}
            style={{ color: props.status === 'init' ? getConfig().styles.primaryColor : '' }}
          >{props.disc}</div>
        </div>
      </div>
    );
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance_journey',
        'stage': 1
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
        title="Insurance Journey"
        handleClick={this.handleClick}
        buttonTitle="Let’s start"
        fullWidthButton={true}
        onlyButton={true}
      >
        <div className="journey-process1">
          {this.state.journeyData && this.state.journeyData.map(this.renderJourney)}
        </div>
        <div className="ins-journey-intro-bottom">
          <div className="ins-journey-intro-bottom1">
            <img className="ins-journey-intro-bottom1a" width="11" src={easy_secure_icon} alt="Insurance" />
            <span className="ins-journey-intro-bottom1b">Easy & secure</span>
          </div>
          <div className="ins-journey-intro-bottom1">
            <img className="ins-journey-intro-bottom1a" width="16" src={eta_icon} alt="Insurance" />
            <span className="ins-journey-intro-bottom1b">5 mins </span>
          </div>
        </div>
      </Container>
    );
  }
}

export default JourneyIntro;
