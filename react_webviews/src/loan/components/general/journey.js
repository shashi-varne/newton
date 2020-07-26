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
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      productName: getConfig().productName
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

    console.log("application_status : " + application_status);
    console.log("dmi_loan_status : " + dmi_loan_status);

    let next_state = '';
    let step_info = 1;
    let withProvider = this.state.withProvider;
    let nextFunction = '';

    dmi_loan_status = 'callback_awaited_decision';

    application_status = 'application_complete';
    if (application_status === 'application_incomplete') {
      cta_title = 'CHECK ELIGIBILITY';
      next_state = 'requirements-details';
    } else if (application_status === 'application_submitted') {
      cta_title = 'CHECK ELIGIBILITY';
      next_state = 'requirements-details';
    } else if (application_status === 'application_complete') {
      if (dmi_loan_status === 'lead' || dmi_loan_status === 'contact') {
        next_state = 'form-summary';
      } else if (dmi_loan_status === 'verified_contact' ||
        dmi_loan_status === 'okyc') {
        next_state = 'instant-kyc';
      } else if (dmi_loan_status === 'callback_awaited_decision') {
        nextFunction = this.decisionCallback;
      } else if (dmi_loan_status === 'decision_done' || dmi_loan_status === 'callback_awaited_conversion' ||
        dmi_loan_status === 'opportunity') {
        withProvider = true;
        step_info = 2;

        if (dmi_loan_status === 'decision_done') {
          cta_title = 'CONTINUE';
        }

        next_state = 'upload-pan';
      }
    }

    console.log(next_state)

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

    if (step_info === 2) {
      journeyData[0].status = 'success';
      journeyData[1].status = 'init';
    } else if (step_info === 3) {
      journeyData[0].status = 'success';
      journeyData[1].status = 'success';
      journeyData[2].status = 'init';

      withProvider = true;
    }

    this.setState({
      journeyData: journeyData,
      withProvider: withProvider,
      nextFunction: nextFunction
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

    if (this.state.nextFunction) {
      this.state.nextFunction();
    } else {
      this.navigate(this.state.next_state);
    }

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
            <div className="journey-card">
              <div className="card-content">
                <span className="dot"></span>
                <b> ELIGIBLE</b>
              </div>
              <div style={{color: '#767e86'}}>Avail sanctioned loan of </div>
              <div><b>{inrFormatDecimal(1000000)}</b></div>
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
        hidePageTitle={true}
      >
        <div className="loan-journey">
          <div style={{display:'flex'}}>
            <div style={{lineHeight:'24px'}}>
              <h2 style={{width:'70%'}}>Get loan in 3 easy steps</h2>
              <div>
                <img src={ require(`assets/${this.state.productName}/ic_document_cash.svg`)} alt="" />
                <span className="journey-steps">Get money within 2 hrs</span>
              </div>
              <div>
                <img src={ require(`assets/${this.state.productName}/ic_document_cloud.svg`)} alt="" />
                <span className="journey-steps">Completely digital and paperless</span>
              </div>
            </div>
            <img src={ require(`assets/${this.state.productName}/ic_why_loan.svg`)} alt="" />
          </div>
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
