import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { numDifferentiationInr, inrFormatDecimal } from 'utils/validators';
import { getCssMapperReport } from '../../constants';
import ContactUs from '../../../common/components/contact_us';

class ReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info', 'personal_info'],
      vendor_info_ui: {
        cssMapper: {}
      },
      personal_info: {}
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {

    this.initialize();
    
  }

  disbursementCallback = async () => {

    this.setState({
      show_loader: true
    })
    let body = {
      "request_type": "disbursement_approval"
    }
    let resultData = await this.callBackApi(body);
    
  

    let vendor_info = this.state.vendor_info || {};
    vendor_info.dmi_loan_status  = resultData.dmi_loan_status;

    this.setVendorData(vendor_info);
    // if (resultData.callback_status) {
      
    // } else {
     
    // }

  }

  setVendorData = (vendor_info) => {
    let data = getCssMapperReport(vendor_info);

    let vendor_info_ui = vendor_info;
    vendor_info_ui.status = data.status;
    vendor_info_ui.cssMapper = data.cssMapper;
    this.setState({
      vendor_info_ui: vendor_info_ui,
    })
  }

  onload = () => {

   
    
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};
    let personal_info = lead.personal_info || {};

    // if(vendor_info.dmi_loan_status === 'callback_awaited_disbursement_approval') {
    //   this.disbursementCallback();
    // } else {
    //   this.setVendorData(vendor_info);
    // }

    this.setVendorData(vendor_info);

   
    this.setState({
      application_info: application_info,
      vendor_info: vendor_info,
      personal_info: personal_info
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan details'
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

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Personal Loan"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        noFooter={true}
        classOverRide={'loanMainContainer'}
      >
        <div className="loan-report-details loan-form-summary">

          <div style={{ margin: '0px 0 40px 0' }} className={`report-color-state ${this.state.vendor_info_ui.cssMapper.color}`}>
            <div className="circle"></div>
            <div className="report-color-state-title">{this.state.vendor_info_ui.cssMapper.disc}</div>
          </div>

          <div className='mid-content'>


            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                Borrower name
                </div>
                <div className="mtr-bottom">
                  {this.state.personal_info.full_name}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  Loan amount
              </div>
                <div className="mtr-bottom">

                  {numDifferentiationInr(this.state.vendor_info_ui.approved_amount_final)}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  Emi amount
              </div>
                <div className="mtr-bottom">
                  {inrFormatDecimal(this.state.vendor_info_ui.approved_emi)}/month
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_date_payment.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  Date of approval
              </div>
                <div className="mtr-bottom">
                  {this.state.vendor_info_ui.dt_approval}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_hs_medical_checkup.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  Application number
              </div>
                <div className="mtr-bottom">
                  {this.state.vendor_info_ui.application_id}
                </div>
              </div>
            </div>

          </div>

        </div>

        <ContactUs />
      </Container>
    );
  }
}

export default ReportDetails;
