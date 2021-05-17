import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import {
  formatAmountInr,
  capitalizeFirstLetter,
} from "../../../utils/validators";
import ContactUs from "../../../common/components/contact_us";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Slide from "@material-ui/core/Slide";
import { getConfig } from "utils/functions";

const Transition = (props) => {
  return <Slide direction="up" {...props} />;
};
class FinalOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "final_loan",
      first_name: "",
      vendor_info: {},
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let personal_info = lead.personal_info || {};
    let application_id = lead.application_id || "";

    this.setState({
      vendor_info: vendor_info,
      first_name: personal_info.first_name,
      application_id: application_id,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_application_submitted",
      properties: {
        user_action: user_action,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    // this.sendEvents("next");
    // this.navigate("reports");
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

  renderDialog = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={true}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
      >
        <DialogContent>
          <div
            className="group-health-bmi-dialog help-query-dialog"
            id="alert-dialog-description"
          >
            <div className="top-content flex-between">
              <div className="generic-page-title">
                <div className="call-back-popup-heading">Query sent!</div>
              </div>
              <img
                className=""
                src={require(`assets/${this.state.productName}/icn_msg_sent.svg`)}
                alt=""
              />
            </div>
            <div className="content-mid">
            IDFC First Bank has sent a verification email to your company id xxx. Validate it to help us fasten your loan application process. Please ignore, if already done.
            </div>
            <div>
              <button
                style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                onClick={() => {
                  this.props.history.push(
                    { pathname: "queries", search: getConfig().searchParams },
                    { fromScreen: "send_query" }
                  );
                }}
                className="call-back-popup-button"
              >
                OKAY
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Loan application submitted"
        handleClick={this.handleClick}
        buttonTitle="CHECK LOAN SUMMARY"
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="final-loan">
          <img
            src={require(`assets/${this.state.productName}/icn_Issue_loan.svg`)}
            style={{ width: "100%" }}
            alt=""
          />

          <div className="head">Loan details:</div>
          <div className="sub-head">
            <div className="tag">
              Application no: {this.state.application_id}
            </div>
            <div className="tag">
              Loan amount: {formatAmountInr(this.state.vendor_info.loanAmount)}
            </div>
          </div>

          <div className="sub-msg">
            <div className="title">What next?</div>
            <div className="sub-title">
              IDFC FIRST Bank’s sales executive will call you within the next 24
              hours and will assist you till loan disbursal.
            </div>
          </div>

          <div className="subtitle">
            Thank you for choosing{" "}
            {capitalizeFirstLetter(this.state.productName)}!
          </div>
          <ContactUs />
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default FinalOffer;
