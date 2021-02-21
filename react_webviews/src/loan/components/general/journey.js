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
      productName: getConfig().productName,
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {

    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};


    let bottomButtonData = {
      leftTitle: 'Personal loan',
      leftSubtitle: numDifferentiationInr(vendor_info.approved_amount_decision)
    }

    this.setState({
      bottomButtonData: bottomButtonData
    })

    // let cta_title = 'RESUME';
    let cta_title = 'CONTINUE';
    let application_status = application_info.application_status || '';
    let application_filled = application_info.application_filled || '';
    let dmi_loan_status = vendor_info.dmi_loan_status;

    let next_state = '';
    let step_info = 1;
    let withProvider = this.state.withProvider;
    let nextFunction = '';

    if (application_status === 'application_incomplete') {
      cta_title = 'CHECK ELIGIBILITY';
      next_state = 'requirements-details';
      if(application_filled) {
        next_state = 'form-summary';
        // cta_title = 'RESUME';
      }
    } else if (application_status === 'application_submitted') {
      // cta_title = 'RESUME';
      cta_title = 'CHECK ELIGIBILITY';
      next_state = 'form-summary';
    } else if (application_status === 'application_complete' ||
      application_status === 'offer_accepted') {
      if (dmi_loan_status === 'lead' || dmi_loan_status === 'contact') {
        next_state = 'form-summary';
        cta_title = 'CHECK ELIGIBILITY';
      } else if (dmi_loan_status === 'verified_contact' ||
        dmi_loan_status.indexOf('okyc') >= 0) {
        next_state = 'instant-kyc';
        cta_title = 'CHECK ELIGIBILITY';
      } else if (dmi_loan_status === 'callback_awaited_decision') {
        nextFunction = this.decisionCallback;
      } else if (dmi_loan_status === 'decision_done') {
        next_state = 'loan-eligible';
      } else if (dmi_loan_status === 'callback_awaited_conversion' ||
        dmi_loan_status === 'opportunity') {
        cta_title = 'CONTINUE';
        withProvider = true;
        step_info = 2;
        next_state = 'upload-pan';
      } else if (['emandate', 'emandate_failed', 'emandate_exit', 'emandate_discrepancy'].indexOf(dmi_loan_status) !== -1) {
        withProvider = true;
        cta_title = 'CONTINUE';
        step_info = 2;
        next_state = 'bank';
      } else if (['emandate_success', 'emandate_done'].indexOf(dmi_loan_status) !== -1) {
        withProvider = true;
        step_info = 3;
        next_state = 'reference';
       
      } else if (['reference_added'].indexOf(dmi_loan_status) !== -1) {
        withProvider = true;
        step_info = 3;
        next_state = 'loan-summary';
      } else if (['callback_awaited_disbursement_approval', 'disbursement_approved', 'complete'].indexOf(dmi_loan_status) !== -1) {
        this.navigate('report-Details');

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
        'title': 'Check eligibility in 5 mins',
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
    } else if (step_info === 4) {
      journeyData[0].status = 'success';
      journeyData[1].status = 'success';
      journeyData[2].status = 'success';

    }

    this.setState({
      journeyData: journeyData,
      withProvider: withProvider,
      nextFunction: nextFunction,
      step_info: step_info
    })
  }

  sendEvents(user_action) {
    let { step_info } = this.state
    let stage;
    if (step_info === 1)
      stage = 'check eligibility'
    else if (step_info === 2)
      stage = 'provide bank detail'
    else if (step_info === 3)
      stage = 'get money'

    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'lending journey',
        "stage": stage
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
        <div style={{width:'100%'}}>
          <div className={` title ${props.status === 'init' ? 'init-title' :
            props.status === 'success' ? 'success-title' :
              'pending-title'}`}>
            {props.title}
          </div>
          {props.key === 'check_eligi' && this.state.vendor_info.approved_amount_decision &&
            <div className="journey-card">
              <div className="card-content">
                <span className="dot"></span>
                <b> ELIGIBLE</b>
              </div>
              <div style={{ color: '#767e86' }}>Avail sanctioned loan of </div>
              <div><b>{inrFormatDecimal(this.state.vendor_info.approved_amount_decision)}</b></div>
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
        classOverRide={'loanMainContainer'}
      >
        <div className="loan-journey">
          <div style={{ display: 'flex' }}>
            <div style={{ lineHeight: '24px' }}>
              <h2 style={{ width: '70%' }}>Get loan in 3 easy steps</h2>
              <div>
                <img src={require(`assets/${this.state.productName}/ic_document_cash.svg`)} alt="" />
                <span className="journey-steps">Get money within 12 hrs</span>
              </div>
              <div>
                <img src={require(`assets/${this.state.productName}/ic_document_cloud.svg`)} alt="" />
                <span className="journey-steps">Completely digital and paperless</span>
              </div>
            </div>
            <img src={require(`assets/${this.state.productName}/ic_why_loan.svg`)} alt="" />
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
