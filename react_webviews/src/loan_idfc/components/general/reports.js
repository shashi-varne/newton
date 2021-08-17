import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import {
  timeStampToDate,
  inrFormatDecimal,
  changeNumberFormat,
} from "utils/validators";
import ContactUs from "../../../common/components/contact_us";

class ReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      cssMapper: {},
      personal_info: {},
      application_info: {},
      vendor_info: {},
      screen_name: 'loan_reports'
    };

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

    let full_name =
      `${personal_info.first_name} ` +
      (personal_info.middle_name ? `${personal_info.middle_name} ` : "") +
      `${personal_info.last_name} `;

    let status = [
      "application_submitted",
      "idfc_3_submitted",
      "idfc_3_accepted",
      "idfc_3_failed",
      "idfc_4_submitted",
      "idfc_4_accepted",
      "idfc_4_failed",
    ];

    let loan_status =
      vendor_info.idfc_loan_status.includes(status)
        ? "DATA VERIFICATION PENDING"
        : vendor_info.idfc_loan_status;

    let cssMapper = {
      "DATA VERIFICATION PENDING": {
        color: "yellow",
        disc: "DATA VERIFICATION PENDING",
      },
      underwriting: {
        color: "yellow",
        disc: "Underwriting",
      },
      verification: {
        color: "yellow",
        disc: "Verification",
      },
      sanctioned: {
        color: "yellow",
        disc: "Sanctioned",
      },
      pre_disbursal_stage: {
        color: "yellow",
        disc: "Pre Disbursal stage",
      },
      disbursal: {
        color: "green",
        disc: "Disbursal",
      },
    };

    this.setState({
      application_info: application_info,
      vendor_info: vendor_info,
      personal_info: personal_info,
      application_id: application_id,
      full_name: full_name,
      loan_status: loan_status,
      cssMapper: cssMapper,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_loan_report",
      properties: {
        user_action: user_action,
        status:
          (this.state.cssMapper[this.state.loan_status || ""] &&
            this.state.cssMapper[this.state.loan_status || ""].disc) ||
          "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents("next");
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          title1: this.state.title1,
          button_text1: "Retry",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Personal Loan Summary"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        noFooter={true}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="loan-report-details loan-form-summary">
          <div
            style={{ margin: "0px 0 40px 0" }}
            className={`report-color-state ${
              this.state.cssMapper[this.state.loan_status || ""] &&
              this.state.cssMapper[this.state.loan_status || ""].color
            }`}
          >
            <div className="circle"></div>
            <div className="report-color-state-title">
              {this.state.cssMapper[this.state.loan_status || ""] &&
                this.state.cssMapper[this.state.loan_status || ""].disc}
            </div>
          </div>

          <div className="mid-content">
            <div className="member-tile">
              <div className="mt-left">
                <img
                  src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)}
                  alt=""
                />
              </div>
              <div className="mt-right">
                <div className="mtr-top">CUSTOMER NAME</div>
                <div className="mtr-bottom">{this.state.full_name}</div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img
                  src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)}
                  alt=""
                />
              </div>
              <div className="mt-right">
                <div className="mtr-top">LOAN AMOUNT*</div>
                <div className="mtr-bottom">
                  ₹
                  {changeNumberFormat(
                    this.state.vendor_info.updated_offer_amount
                  )}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img
                  src={require(`assets/${this.state.productName}/icn_ROI.svg`)}
                  style={{ margin: "0 3px 0 5px" }}
                  alt=""
                />
              </div>
              <div className="mt-right">
                <div className="mtr-top">RATE OF INTEREST*</div>
                <div className="mtr-bottom">
                  {Math.round(this.state.vendor_info.updated_offer_roi)}% p.a.
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img
                  src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)}
                  alt=""
                />
              </div>
              <div className="mt-right">
                <div className="mtr-top">EMI AMOUNT*</div>
                <div className="mtr-bottom">
                  {inrFormatDecimal(this.state.vendor_info.updated_offer_emi)}
                  /month
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img
                  src={require(`assets/${this.state.productName}/ic_date_payment.svg`)}
                  alt=""
                />
              </div>
              <div className="mt-right">
                <div className="mtr-top">APPLICATION SUBMISSION DATE</div>
                <div className="mtr-bottom">
                  {timeStampToDate(
                    this.state.application_info.dt_updated || ""
                  )}
                </div>
              </div>
            </div>

            <div className="member-tile">
              <div className="mt-left">
                <img
                  src={require(`assets/${this.state.productName}/ic_hs_medical_checkup.svg`)}
                  alt=""
                />
              </div>
              <div className="mt-right">
                <div className="mtr-top">APPLICATION NUMBER</div>
                <div className="mtr-bottom">{this.state.application_id}</div>
              </div>
            </div>
          </div>

          <div className="disclaimer">
            <div>*</div>
            <div className="subtitle">Indicated figures are as per the initial loan offer. These are
            subject to change.</div>
          </div>
        </div>

        <ContactUs />
      </Container>
    );
  }
}

export default ReportDetails;
