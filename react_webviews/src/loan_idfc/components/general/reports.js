import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { timeStampToDate, inrFormatDecimal, changeNumberFormat } from 'utils/validators';
import { getCssMapperReport } from '../../constants';
import ContactUs from '../../../common/components/contact_us';

class ReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      vendor_info_ui: {
        cssMapper: {}
      },
      personal_info: {},
      application_info: {},
      vendor_info: {}
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
    let personal_info = lead.personal_info || {};
    let application_id = lead.application_id || "";

    let full_name = `${personal_info.first_name} ` + (personal_info.middle_name ? `${personal_info.middle_name} ` : "") + `${personal_info.last_name} ` 
   
    this.setState({
      application_info: application_info,
      vendor_info: vendor_info,
      personal_info: personal_info,
      application_id: application_id,
      full_name: full_name
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'idfc_lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan_report',
        status :this.state.vendor_info_ui.cssMapper.disc,
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
                CUSTOMER NAME
                </div>
                <div className="mtr-bottom">
                  {this.state.full_name}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  LOAN AMOUNT
              </div>
                <div className="mtr-bottom">

                ₹{changeNumberFormat(this.state.vendor_info.updated_offer_amount)}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  RATE OF INTEREST
              </div>
                <div className="mtr-bottom">
                  {inrFormatDecimal(this.state.vendor_info.updated_offer_roi)}/month
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  EMI AMOUNT
              </div>
                <div className="mtr-bottom">
                  {inrFormatDecimal(this.state.vendor_info.updated_offer_emi)}/month
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_date_payment.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  APPLICATION SUBMISSION DATE
              </div>
                <div className="mtr-bottom">
                  {timeStampToDate(this.state.vendor_info.dt_updated || "")}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img src={require(`assets/${this.state.productName}/ic_hs_medical_checkup.svg`)} alt="" />
              </div>
              <div className="mt-right">
                <div className="mtr-top">
                  APPLICATION NUMBER
              </div>
                <div className="mtr-bottom">
                  {this.state.application_id}
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
