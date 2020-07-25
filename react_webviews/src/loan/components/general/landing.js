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
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      productName: getConfig().productName
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let stepsContentMapper = {
      title: 'Eligibility criteria',
      options: [
        { 'icon': 'ic_why_loan1', 'subtitle': 'Salaried and resident Indian citizens' },
        { 'icon': 'ic_why_loan2', 'subtitle': 'Aged between 21 and 58 years' },
        { 'icon': 'ic_why_loan3', 'subtitle': 'Employed with a private, public limited company, or an MNC' }
      ]
    }

    this.setState({
      stepsContentMapper
    })
  }

  onload = async () => {
    console.log(this.state.lead);
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

    this.sendEvents('next', {things_to_know: 'faq'})
    let options = [
      {
        'title': 'What is the max loan amount you can get when you apply for a salaried personal loan?',
        'subtitle': 'You can avail an instant personal amount up to 1 lakh.'
      },
      {
        'title': 'On what criteria will the loan be sanctioned to me ?',
        'subtitle': 'The final amount sanctioned will depend on your income, your CIBIL score and other eligibility criteria.'
      },
      {
        'title': `Is ${this.state.productName} the lender ?`,
        'subtitle': `No. ${this.state.productName} is not the lender. ${this.state.productName} will only facilitate your 
        loan application for availing credit facilities. ${this.state.productName} has a contractual 
        relationship with DMI Finance Pvt Ltd who offers credit facilities to the users of the app. 
        Any credit facility offered to you by any lender on App shall be governed by Terms and 
        Conditions agreed 
        between you and the lender and ${this.state.productName} shall not be a party to the same.`
      },
      {
        'title': `What are the benefits of applying for loan from ${this.state.productName}?`,
        'subtitle': `1.     Digital loans: Bid farewell to piles of paperwork and branch visits
        2.     Zero documentation: No income documents required
        3. Money in account within 2 hrs: Submit loan application in 10 mins and get credit within 2 hrs
        4.  Collateral free loan: You don’t have to provide any security for your loan
        `
      },
      {
        'title': `What documents are required to get a Personal loan from ${this.state.productName}?`,
        'subtitle': `You just need to upload a photo of your PAN card to get a Personal 
        loan from ${this.state.productName}. No other documents are required `
      },
      {
        'title': 'What will be my EMI payment date ?',
        'subtitle': 'If the loan disbursal date is before 20th or on 20th of a month, EMI date will be 5th of next month. If the loan disbursal date is after the 20th of a particular month then EMI date will be 5th of next to next month.'
      },
      {
        'title': 'Are there any foreclosure and prepayment charge?',
        'subtitle': 'Yes, there are foreclosure and part-prepayment charges applicable which will be mentioned in your loan agreement.'
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


  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Personal loan"
        noHeader={this.state.show_loader}
        buttonTitle="APPLY NOW"
        events={this.sendEvents('just_set_events')}
      >
        <div className="loan-landing loan-instant-kyc-home" >
          <div className="infoimage-block1" onClick={() => this.navigate('check-how1')} >
          
            <img style={{ width: '100%', cursor: 'pointer' }} 
            src={require(`assets/${this.state.productName}/ils_loan_intro_card.svg`)} alt="" />
            <div className="inner">
              <div className="title generic-page-title" style={{color: 'white'}}>
                Personalised instant loan
              </div>
              <div className="button">
                <Button variant="raised"
                  size="large" color="secondary" autoFocus>
                  Apply now
                  </Button>
              </div>
              <div className="bottom-content">
                No paper-work | Money in A/c within 2 hrs
              </div>
            </div>
          </div>

          <div className="action" onClick={() => this.redirectKyc()}>
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
            Simple and hassle-free process
          </div>

          <div className="his">
            <div className="horizontal-images-scroll">
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_loan2.svg`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_loan2.svg`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_loan2.svg`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_loan2.svg`)} alt="" />
            </div>
          </div>

          <div className="generic-page-title" style={{margin:'30px 0 10px 0'}}>
            Things to know
          </div>
          <div className="generic-hr"></div>
          <div className="flex faq" onClick={() => this.openFaqs()}>
            <div>
              <img className="accident-plan-read-icon"
                src={require(`assets/${this.state.productName}/ic_document_copy.svg`)} alt="" />
            </div>
            <div>
              Frequently asked questions
            </div>
          </div>
          <div className="generic-hr"></div>

          <div style={{color: '#0A1D32', fontSize:13}}>
            In partnership with
            <img style={{marginLeft: 10}} src={dmi_logo} alt="" />
          </div>

        </div>

      </Container>
    );
  }
}

export default Landing;
