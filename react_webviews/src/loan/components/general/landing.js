import React, { Component } from 'react';
import Container from '../../common/Container';
import Button from 'material-ui/Button';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { getConfig } from "utils/functions";
import next_arrow from 'assets/next_arrow.svg';
import SVG from 'react-inlinesvg';
import HowToSteps from '../../../common/ui/HowToSteps';
import dmi_logo from 'assets/dmi_logo.svg';
import ic_why_hs_fisdom from 'assets/fisdom/ic_why_hs_loan.svg';
import ic_why_hs_myway from 'assets/finity/ic_why_hs_loan.svg';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      hassleFreePoints: [],
      top_cta_title: '',
      productName: getConfig().productName,
      ic_why_hs: getConfig().productName === 'fisdom' ? ic_why_hs_fisdom : ic_why_hs_myway,
      resume_clicked: false,
      faq_clicked: false,
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let stepsContentMapper = {
      title: 'Eligibility criteria',
      options: [
        { 'icon': 'ic_why_loan1', 'subtitle': 'Salaried and resident Indian citizens' },
        { 'icon': 'ic_why_loan2', 'subtitle': 'Age between 23 and 55 years' },
        { 'icon': 'ic_why_loan3', 'subtitle': 'Employed with a private, public limited company, or a MNC' }
      ]
    }

    let hassleFreePoints = [

      {
          'title': 'Get loan upto 1 lac with no human interaction',
          'icon' : 'ic_document_note'
      },
       {
          'title': 'No income documents required',
          'icon' : 'ic_why_loan_3'
      },
       {
          'title': 'Complete easy loan application process and get money within 48 hrs',
          'icon' : 'ic_why_loan_4'
      },
       {
          'title': "You don't have to provide any security  for your loan",
          'icon' : 'ic_document_amount'
      }
  ]

    this.setState({
      stepsContentMapper:stepsContentMapper,
      hassleFreePoints:hassleFreePoints
    })
  }

  onload = async () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    let rejection_reason = application_info.rejection_reason || '';

    this.setState({
      reason: rejection_reason
    });

    if(vendor_info.dmi_loan_status === 'complete') {
      this.navigate('report');
      return;
    }

    let process_done = false;
    let isResume = true;
    let top_cta_title = 'RESUME';

    if(!application_info.latitude || !application_info.network_service_provider) {
      this.setState({
        location_needed: true
      })

      isResume = false;
      top_cta_title = 'APPLY NOW';

      this.setState({
        isResume: isResume
      })
    }

    if(['callback_awaited_disbursement_approval', 'disbursement_approved'].indexOf(vendor_info.dmi_loan_status) !== -1) {
      process_done = true;
    }

    this.setState({
      application_info: application_info,
      vendor_info: vendor_info,
      isResume: isResume,
      process_done: process_done,
      top_cta_title: top_cta_title
    })
  }

  sendEvents(user_action, data = {}) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction',
        "action": data.action,
        "calculator_clicked": data.calculator_clicked ? "yes" : "no",
        "resume_clicked": (this.state.isResume && !data.action) || !this.state.isResume ? 'no' : 'yes',
        "faq_clicked": data.things_to_know === 'faq' ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  openFaqs = () => {

    let type = this.state.productName;
    let typeCaps = type === 'fisdom' ? 'Fisdom' : 'Finity';

    this.sendEvents('next', {things_to_know: 'faq'})
    let options = [
      {
        'title': 'What is the max loan amount for salaried Personal loan ?',
        'subtitle': 'Max loan amount is 1 lac.'
      },
      {
        'title': 'On what criteria will the loan be sanctioned to me ?',
        'subtitle': 'The final amount sanctioned will depend on your net monthly income, your credit bureau and other eligibility criterias.'
      },
      {
        'title': `Is ${typeCaps} the lender ?`,
        'subtitle': `${typeCaps} is not the lender. ${typeCaps} will only facilitate your 
        loan application for availing credit facilities. ${typeCaps} has a contractual 
        relationship with DMI Finance Pvt Ltd who offers credit facilities to the users of the app. 
        Any credit facility offered to you by any lender on App shall be governed by Terms and 
        Conditions agreed 
        between you and the lender and ${typeCaps} shall not be a party to the same.`
      },
      {
        'title': `What are the benefits of applying for a personal loan from ${typeCaps} ?`,
        points: [
          'Digital loans: Bid farewell to piles of paperwork and branch visits',
          'Zero documentation: No income documents required',
          'Money in account within 48 hrs: Submit loan application in 10 mins and get credit within 48 hrs',
          'Collateral free loan: You don’t have to provide any security for your loan'
        ]
      },
      {
        'title': `What documents are required to get a Personal loan from ${typeCaps}?`,
        'subtitle': `You just need to upload a photo of your PAN card to get a Personal 
        loan from ${typeCaps}. No other documents are required.`
      },
      {
        'title': 'What will be my First EMI payment date ?',
        'subtitle': `
        Cases disbursed between 1st to 20th of the month – will have their first EMI on 5th of coming month.</br>
        Cases disbursed between 21st till last day of month – will have first EMI on 5th of next to next month.</br>
        Please note – there will be few cases approved on 20th but will get disbursed on 21st or later date 
        (due to bank holiday or late hours), but their first EMI will be on 5th of next month only.</br>
        `
      },
      {
        'title': 'Are there any prepayment charges ?',
        'subtitle': 'Prepayment not allowed for first 6 months. Prepayment charges of 3% flat on the o/s principal to be applied post this.'
      },
      {
        'title': 'What is the minimum and maximum period for repayment?',
        'subtitle': 'Minimum tenor is 6 months and maximum is 24 months.'
      },
      {
        'title': 'What is the Processing fee? ',
        'subtitle': 'Processing fee is 2% of gross disbursement amount plus GST as applicable.'
      }
    ];

    let renderData = {
      'header_title': 'Frequently asked questions',
      'header_subtitle': '',
      'steps': {
        'options': options
      },
      'cta_title': 'OK'
    }

    this.props.history.push({
      pathname: '/gold/common/render-faqs',
      search: getConfig().searchParams,
      params: {
        renderData: renderData
      }
    });
  }

  getNextState = () => {
    let dmi_loan_status = this.state.vendor_info.dmi_loan_status || '';
    let application_status = this.state.application_info.application_status || '';

    let state = '';
    if(this.state.process_done) {
      state = 'report-details';
    } else {
      if(this.state.location_needed) {//condition for mobile
        state = 'permissions';
      } else if(dmi_loan_status === 'application_rejected' || application_status === 'internally_rejected') {
        state = 'instant-kyc-status';
      }else {
        state = 'journey';
      }
    }

    return state;
  }

  handleClickTopCard = (action) => {
    if (action === 'banner') {
      this.sendEvents('next', {action: 'banner'})
    } else {
      this.sendEvents('next', { action: this.state.top_cta_title });
    }

    let state =  this.getNextState();
    let rejection_reason = this.state.reason || '';

    if (state === 'instant-kyc-status') {
      let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
      this.navigate(state, {
        searchParams: searchParams,
        params: {
          rejection_reason: rejection_reason
        }
      });
    
    } else {
      this.navigate(state);
    }
    
  }

  renderHasslePoints = (props, index) => {
    return(
      <div key={index} className="hassle-free-tile" style={{
      backgroundImage: `url(${this.state.ic_why_hs})`
    }}>
      <div className={`card-info ${this.state.productName} hft-title`}>
      {props.title}
      </div>
      <div className="hft-icon">
        <img src={ require(`assets/${this.state.productName}/${props.icon}.svg`)} alt="" />
      </div>
    </div>
    )
  }

 
  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Personal loan"
        noHeader={this.state.show_loader}
        buttonTitle={this.state.top_cta_title}
        noFooter={true}
        handleClick={this.handleClickTopCard}
        events={this.sendEvents('just_set_events')}
      >
       
       <div className="loan-landing loan-instant-kyc-home" >
        <div className="infoimage-block1" onClick={() => this.handleClickTopCard("banner")} >
        
          <img style={{ width: '100%', cursor: 'pointer', borderRadius: 6 }}
          src={require(`assets/${this.state.productName}/ils_loan_intro_card.svg`)} alt="" />
          <div className="inner">
            <div className="title generic-page-title" style={{color: 'white'}}>
              Personalised instant loan
            </div>
            <div className="button">
              <Button  variant="raised"
                size="large" color="secondary" autoFocus>
                {this.state.top_cta_title}
                </Button>
            </div>
            <div className="bottom-content">
              No paper-work | Money in A/c within 48 hrs
            </div>
          </div>
        </div>

        <div className="action" onClick={ () => {
          this.sendEvents('next', {calculator_clicked: true})
          this.navigate('calculator', {
          params: {
            next_state: this.getNextState(),
            cta_title: this.state.top_cta_title,
            rejection_reason: this.state.reason
          }
        })}}>
          <div className="left">
          Loan eligibility calculator
            </div>
            <SVG
              className="right"
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
              src={next_arrow}
            />
          
        </div>

        <HowToSteps style={{ marginTop: 20,marginBottom:0 }} baseData={this.state.stepsContentMapper} />

        <div className="generic-page-title" style={{ margin: '20px 0 15px 0' }}>
        Benefits & Features
        </div>

        <div className="his">
          <div className="horizontal-images-scroll">
                {this.state.hassleFreePoints.map(this.renderHasslePoints)}
          </div>
        </div>

        <div className="generic-page-title" style={{margin:'30px 0 10px 0'}}>
          Things to know
        </div>
        <div className="generic-hr"></div>
        <div className="flex faq" onClick={() => this.openFaqs()}>
          <div>
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_help.svg`)} alt="" />
          </div>
          <div>
            Frequently asked questions
          </div>
        </div>
        <div className="generic-hr"></div>

        <div className="dmi-info">
          In partnership with
          <img style={{marginLeft: 10}} src={dmi_logo} alt="" />
        </div>

        <Button style={{height: 50}} fullWidth={true} variant="raised"
                      size="large" onClick={this.handleClickTopCard} color="secondary"
        >
                    {this.state.top_cta_title}
        </Button>

      </div>
      </Container>
    );
  }
}

export default Landing;
