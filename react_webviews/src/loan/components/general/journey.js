import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import BottomInfo from '../../../common/ui/BottomInfo';
import { getConfig } from 'utils/functions';
import SVG from 'react-inlinesvg';
import { numDifferentiationInr } from 'utils/validators';

let icon_mapper = {
  'pending': 'not_done_yet_step',
  'init': 'not_done_yet_step',
  'failed': 'text_error_icon',
  'success': 'ic_completed'
};

class Journey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      journeyData: [],
      icon_mapper: icon_mapper,
      withProvider: true
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let bottomButtonData = {
      leftTitle: 'Personal loan',
      leftSubtitle: numDifferentiationInr(1000000)
    }

    this.setState({
      bottomButtonData: bottomButtonData
    })
  }

  onload = () => {
    let journeyData = [
      {
        'title': 'Check eligibility ',
        'key': 'check_eligi',
        'status': 'success'
      },
      {
        'title': 'Provide PAN and bank details',
        'key': 'provide_pan',
        'status': 'init'
      },
      {
        'title': 'Get money into your bank a/c',
        'key': 'get_money',
        'status': 'pending'
      }
    ];

    this.setState({
      journeyData: journeyData
    })
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
  }

  getJourneyBorder = (props, index) => {
    if (index === this.state.journeyData.length - 1) {
      return '2px solid white';
    } else if (props.status === 'success') {
      return '2px solid ' + getConfig().primary;
    }

    return '';
  }

  renderJourney = (props, index) => {
    return (
      <div key={index} className="tile" style={{ borderLeft: this.getJourneyBorder(props, index) }}>
        <div style={{ position: 'relative' }}>
          {props.status === 'success' &&
            <SVG
              style={{ backgroundColor: '#fff', zIndex: 111 }}
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
              src={require(`assets/${this.state.icon_mapper[props.status]}.svg`)}
              className="icon normal-step-icon"
            />}
          {props.status === 'init' &&
            // <SVG
            //   // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
            //   src={require(`assets/${this.state.icon_mapper[props.status]}.svg`)}
            //   className="icon normal-step-icon"
            // />
            <p className="init-text">{index + 1}</p>
          }

          {props.status === 'pending' &&
            <SVG
              // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
              src={require(`assets/${this.state.icon_mapper[props.status]}.svg`)}
              className="icon normal-step-icon"
            />
          }
          {props.status === 'pending' &&

            <p className="text-on-img">{index + 1}</p>
          }
        </div>
        <div className={` title ${props.status === 'init' ? 'init-title' :
          props.status === 'success' ? 'success-title' :
            'pending-title'}`}>
          {props.title}
        </div>
      </div>

    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Get loan in 3 easy steps"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        withProvider={this.state.withProvider}
        buttonData={this.state.bottomButtonData}
      >
        <div className="loan-journey">
          <div className="generic-progress-vertical">
            {this.state.journeyData.map(this.renderJourney)}
          </div>
        </div>
        <BottomInfo baseData={{ 'content': 'Completely paperless process with instant approval' }} />
      </Container>
    );
  }
}

export default Journey;
