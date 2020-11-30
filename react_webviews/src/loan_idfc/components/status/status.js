import React, { Component } from "react";
import Container from "../../common/Container";
// import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { getUrlParams } from "utils/validators";

const commonMapper = {
  "idfc_0.5_rejected": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "OK",
    icon: 'close',
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "idfc_0.5_submitted": {
    top_icon: "ils_loan_status",
    top_title: "Congratulations, Aamir!",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
  },
  "idfc_0.5_accepted": {
    top_icon: "ils_loan_status",
    top_title: "Congratulations, Aamir!",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
  },
  "idfc_1.1_accepted": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "OK",
    icon: 'close',
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "salary reciept mode": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: 'close',
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "salary": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: 'close',
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "Age": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: 'close',
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  }
};

class LoanStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: getUrlParams(),
      commonMapper: {},
      idfc_loan_status: "",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let application_info = lead.application_info || {};
    let idfc_loan_status = vendor_info.idfc_loan_status;
    let application_status = application_info.application_status;

    if (application_info === "internally_rejected") {
      this.setState({
        commonMapper: commonMapper[application_status] || {},
        application_status: application_status
      })
    } else {
      this.setState({
        commonMapper: commonMapper[idfc_loan_status] || {},
        idfc_loan_status: idfc_loan_status,
      });
    }

  };

  goBack = () => {
    this.navigate(this.state.commonMapper.close_state);
  };

  handleClick = () => {
    this.navigate(this.state.commonMapper.cta_state);
  };

  render() {
    let { commonMapper, idfc_loan_status, application_status } = this.state;
    console.log(application_status)
    return (
      <Container
        showLoader={this.state.show_loader}
        title={commonMapper.top_title}
        buttonTitle={commonMapper.button_title}
        handleClick={this.handleClick}
        headerData={{
          icon: commonMapper.icon || '',
          goBack: this.goBack,
        }}
      >
        <div className="idfc-loan-status">
          {commonMapper["top_icon"] && (
            <img
              src={require(`assets/${this.state.productName}/${commonMapper["top_icon"]}.svg`)}
              alt=""
            />
          )}
          {application_status === "Salary receipt mode" && <div className="subtitle">
            We’re unable to approve your loan request because as per IDFC’s loan
            policy your monthly salary does not qualify you for a personal loan
            at this point.
          </div>}

          {application_status === "Salary" && <div className="subtitle">
            We’re unable to approve your loan request because as per IDFC’s loan
            policy your salary receipt mode does not make you eligible for a
            personal loan at this point.
          </div>}

          {application_status === "Age" && <div className="subtitle">
            We're unable to take your loan application forward as you don't fall
            under the minimum age criteria as per IDFC's loan policy.
          </div>}

          {idfc_loan_status === "idfc_0.5_rejected" && (
            <div className="subtitle">
              We're so sorry to inform you that IDFC has rejected your loan
              application as it did not meet their loan policy.
            </div>
          )}

          {(idfc_loan_status === "idfc_0.5_submitted" || idfc_loan_status === "idfc_0.5_accepted") && <div>
            <div className="subtitle">
              Your profile has been successfully evaluated and basis the checks
              you're most likely to get a loan offer.
            </div>
            <div
              className="subtitle"
              style={{ color: "var(--primary)", fontSize: "14px" }}
            >
              <b>To view the final loan amount, provide your income details.</b>
            </div>
          </div>}
        </div>
      </Container>
    );
  }
}

export default LoanStatus;
