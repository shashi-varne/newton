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
import ic_why_hs_fisdom from 'assets/fisdom/ic_why_hs.svg';
import ic_why_hs_myway from 'assets/myway/ic_why_hs.svg';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      top_cta_title: '',
      productName: getConfig().productName,
      ic_why_hs: getConfig().productName === 'fisdom' ? ic_why_hs_fisdom : ic_why_hs_myway
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
        { 'icon': 'ic_why_loan3', 'subtitle': 'Employed with a private, public limited company, or an MNC' }
      ]
    }

    this.setState({
      stepsContentMapper
    })
  }

  onload = async () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

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


  openFaqs = () => {

    let type = this.state.productName;
    let typeCaps = type === 'fisdom' ? 'Fisdom' : 'Myway';

    this.sendEvents('next', {things_to_know: 'faq'})
    let options = [
      {
        'title': 'What is the max loan amount for salaried Personal loan ?',
        'subtitle': 'Max loan amount is 1 lac.'
      },
      {
        'title': 'On what criteria will the loan be sanctioned to me ?',
        'subtitle': 'The final amount sanctioned will depend on your net monthly income,your credit bureau and other eligibility criterias.'
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
        'subtitle': `
        1. Digital loans: Bid farewell to piles of paperwork and branch visits.</br>
        2. Zero documentation: No income documents required.</br>
        3. Money in account within 2 hrs: Submit loan application in 10 mins and get credit within 2 hrs.</br>
        4. Collateral free loan: You don’t have to provide any security for your loan.</br>
        `
      },
      {
        'title': `What documents are required to get a Personal loan from ${typeCaps}?`,
        'subtitle': `You just need to upload a photo of your PAN card to get a Personal 
        loan from ${typeCaps}. No other documents are required.`
      },
      {
        'title': 'What will be my First EMI payment date ?',
        'subtitle': `
        1. Cases disbursed between 1st to 20th of the month – will have their first EMI on 5th of coming month.</br>
        2. Cases disbursed between 21st till last day of month – will have first EMI on 5th of next to next month.</br>
        3· Please note – there will be few cases approved on 20th but will get disbursed on 21st or later date 
        (due to bank holiday or late hours), but their first EMI will be on 5th of next month only.</br>
        `
      },
      {
        'title': 'Are there any prepayment charges ?',
        'subtitle': 'Prepayment not allowed for first 6 months. Prepayment charges of 3% flat on the o/s principal to be applied post this.'
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
      pathname: '/common/render-faqs',
      search: getConfig().searchParams,
      params: {
        renderData: renderData
      }
    });
  }

  getNextState = () => {
    let dmi_loan_status = this.state.vendor_info.dmi_loan_status || '';

    let state = '';
    if(this.state.process_done) {
      state = 'report-details';
    } else {
      if(this.state.location_needed) {//condition for mobile
        state = 'permissions';
      } else if(dmi_loan_status === 'application_rejected') {
        state = 'instant-kyc-status';
      } else {
        state = 'journey';
      }
    }

    return state;
  }

  handleClickTopCard = () => {

    let state =  this.getNextState();

    if(state === 'instant-kyc-status') {
      let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
      this.navigate(state, {searchParams: searchParams});
    } else {
      this.navigate(state);
    }
    
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
        <div className="infoimage-block1" onClick={() => this.handleClickTopCard()} >
        
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
              No paper-work | Money in A/c within 2 hrs
            </div>
          </div>
        </div>

        <div className="action" onClick={ () => this.navigate('calculator', {
          params: {
            next_state: this.getNextState(),
            cta_title: this.state.top_cta_title
          }
        })}>
          <div className="left">
          Loan eligibility calculator
            </div>
            <SVG
              className="right"
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
              src={next_arrow}
            />
          
        </div>

        <HowToSteps style={{ marginTop: 20,marginBottom:0 }} baseData={this.state.stepsContentMapper} />

        <div className="generic-page-title" style={{ margin: '20px 0 15px 0' }}>
        Simple and hassle-free process to "Benefits & Features"
        </div>

        <div className="his">
          <div className="horizontal-images-scroll">
            <div style={{height:'112px', width:'172px', marginRight:'16px',
              backgroundImage: `url(${this.state.ic_why_hs})`
            }}>
              <div className={`card-info ${this.state.productName}`} style={{padding:'10px 0 10px 20px'}}>
              Get loan upto 1 lac with no human interaction
              </div>
              <div style={{float:'right', paddingRight:'22px'}}>
                <img src={ require(`assets/${this.state.productName}/ic_document_note.svg`)} alt="" />
              </div>
            </div>

            <div style={{height:'112px', width:'172px', marginRight:'16px',
              backgroundImage: `url(${this.state.ic_why_hs})`
            }}>
              <div className={`card-info ${this.state.productName}`} style={{padding:'10px 0 30px 20px'}}>
                No income documents required
              </div>
              <div style={{float:'right', paddingRight:'22px'}}>
                <img src={ require(`assets/${this.state.productName}/ic_why_loan_3.svg`)} alt="" />
              </div>
            </div>

            <div style={{height:'112px', width:'172px', marginRight:'16px',
              backgroundImage: `url(${this.state.ic_why_hs})`
            }}>
              <div className={`card-info ${this.state.productName}`} style={{padding:'10px 0 10px 20px'}}>
                Complete easy loan application process and get money in 2 hrs 
              </div>
              <div style={{float:'right', paddingRight:'22px'}}>
                <img src={ require(`assets/${this.state.productName}/ic_why_loan_4.svg`)} alt="" />
              </div>
            </div>

            <div style={{height:'112px', width:'172px', marginRight:'16px',
              backgroundImage: `url(${this.state.ic_why_hs})`
            }}>
              <div className={`card-info ${this.state.productName}`} style={{padding:'10px 0 10px 20px'}}>
                You don't have to provide any security  for your loan
              </div>
              <div style={{float:'right', paddingRight:'22px'}}>
                <img src={ require(`assets/${this.state.productName}/ic_document_amount.svg`)} alt="" />
              </div>
            </div>

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
