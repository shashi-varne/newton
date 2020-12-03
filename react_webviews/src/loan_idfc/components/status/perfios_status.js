import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import { getUrlParams } from "utils/validators";

const commonMapper = {
  failure: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification failed",
    button_title: "RETRY",
    icon: "close",
    // cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
  },
  success: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification successful",
    button_title: "NEXT",
    icon: "close",
    // cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  blocked: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification failed",
    button_title: "OK",
    icon: "close",
    // cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  bypass: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification failed",
    button_title: "NEXT",
    icon: "close",
    // cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
};

class PerfiosStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      commonMapper: {},
      perfios_state: "",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let perfios_state = vendor_info.perfios_state;
    let idfc_07_state = vendor_info.idfc_07_state;
    
    let bt_eligible = Object.keys(lead.bt_info || {}).length !== 0 ? true : false;
    // let bt_eligible = this.state.params
    //   ? this.state.params.bt_eligible
    //   : vendor_info.bt_eligible;

    // let { status, bt_eligible } = this.state.params;

    this.setState({
      commonMapper: commonMapper[perfios_state] || {},
      perfios_state: perfios_state,
      bt_eligible: bt_eligible,
      idfc_07_state: idfc_07_state,
    });
  };

  goBack = () => {
    this.navigate(this.state.commonMapper.close_state);
  };

  getPointSevenCallback = async () => {
    this.setState({
      show_loader: true,
    });

    await this.getOrCreate();

    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    if (vendor_info.idfc_07_state === "success") {
      this.submitApplication({}, "one");
    } else {
      this.getPointSevenCallback();
    }
  };

  handleClick = () => {
    let { perfios_state, bt_eligible, idfc_07_state } = this.state;

    if (perfios_state === "success") {
      if (!bt_eligible && idfc_07_state === "success") {
        this.submitApplication({}, "one");
      }

      if (
        bt_eligible &&
        (idfc_07_state === "success" || idfc_07_state === "triggered")
      ) {
        let body = {
          idfc_loan_status: "bt_init",
        };
        this.updateApplication(body, "bt-info");
      }

      if (!bt_eligible && idfc_07_state === "triggered") {
        this.getPointSevenCallback();
      }
    }

    if (perfios_state === "bypass") {
      this.submitApplication({}, "one");
    }

    if (perfios_state === "failure") {
      let body = {
        perfios_state: 'init',
      };
      this.updateApplication(body, "income-details");
    }
  };

  render() {
    let { commonMapper, perfios_state, bt_eligible } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        title={commonMapper.top_title}
        buttonTitle={commonMapper.button_title}
        handleClick={this.handleClick}
        headerData={{
          icon: commonMapper.icon || "",
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

          {perfios_state === "success" && (
            <div className="subtitle">
              Hey Aamir, IDFC has successfully verified your bank statements and
              your income details have been safely updated.
            </div>
          )}
          {/* <div className="subtitle">
            Before we move to the final loan offer, we have an option of
            <b> 'Balance Transfer - BT'</b> for you. However, it is up to you
            whether you want to opt for it or not.
          </div> */}

          {perfios_state === "bypass" && (
            <div className="subtitle">
              Due to an error your bank statements couldn't be verfied. No
              worries, you can still go ahead with your loan application.
              However, do upload your bank statements later.
            </div>
          )}

          {perfios_state === "blocked" && (
            <div className="subtitle">
              Due to an error your bank statements couldn't be verfied. No
              worries, you can still go ahead with your loan application.
              However, do upload your bank statements later.
            </div>
          )}

          {bt_eligible && (
            <div className="subtitle">
              Before we move to the final loan offer, we have an option of
              'Balance Transfer - BT' for you. However, it is up to you whether
              you want to opt for it or not.
            </div>
          )}

          {perfios_state === "failure" && (
            <div className="subtitle">
              Your <b>statements</b> could not be verified as it <b>exceeds</b>{" "}
              the <b>maximum allowed file size.</b> We recommend you to{" "}
              <b>try again</b> by uploading bank statements of{" "}
              <b>smaller file size</b> to get going/proceed with the
              verification process.
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default PerfiosStatus;
