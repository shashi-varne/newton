import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import BottomInfo from '../../../common/ui/BottomInfo';
import { getConfig } from 'utils/functions';
import SVG from 'react-inlinesvg';
import { numDifferentiationInr, inrFormatDecimal } from 'utils/validators';

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
      withProvider: false,
      get_lead:true,
      getLeadBodyKeys: ['vendor_info'],
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

    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    let cta_title = 'RESUME';
    let application_status = application_info.application_status || '';
    let dmi_loan_status = vendor_info.dmi_loan_status;

    console.log("application_status : "  + application_status);
    console.log("dmi_loan_status : "  + dmi_loan_status);

    let next_state = '';
    let step_info = 1;
    let withProvider = this.state.withProvider;

    if(application_status === 'application_incomplete') {
      cta_title = 'CHECK ELIGIBILITY';
      next_state = 'requirements-details';
    } else if(application_status === 'application_submitted') {
      if(dmi_loan_status === 'lead') {
        cta_title = 'CHECK ELIGIBILITY';
        next_state = 'requirements-details';
      } else if(dmi_loan_status === 'contact' || dmi_loan_status === 'verified_contact') {
        cta_title = 'CHECK ELIGIBILITY';
        next_state = 'form-summary';
      }
      
    }

   

    this.setState({
      application_info: application_info,
      vendor_info: vendor_info,
      cta_title: cta_title,
      next_state: next_state
    })

    let journeyData = [
      {
        'title': 'Check eligibility in 5 min',
        'key': 'check_eligi',
        'status': 'init'
      },
      {
        'title': 'Provide PAN and bank details',
        'key': 'provide_pan',
        'status': 'pending'
      },
      {
        'title': 'Get money into your bank a/c',
        'key': 'get_money',
        'status': 'pending'
      }
    ];

    if(step_info === 2) {
      journeyData[0].status = 'success';
      journeyData[1].status = 'init';
    } else if(step_info === 3) {
      journeyData[0].status = 'success';
      journeyData[1].status = 'success';
      journeyData[2].status = 'init';

      withProvider = true;
    }


    this.setState({
      journeyData: journeyData,
      withProvider: withProvider
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
    this.navigate(this.state.next_state);
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
        <div>
        <div className={` title ${props.status === 'init' ? 'init-title' :
          props.status === 'success' ? 'success-title' :
            'pending-title'}`}>
          {props.title}
        </div>
       {props.key === 'check_eligi' &&
        <div style={{margin: '0 0 0 30px'}}>
          {inrFormatDecimal(1000000)}
        </div>}
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
        buttonTitle={this.state.cta_title}
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
