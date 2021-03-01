import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";

class IncomeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
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
    let progressHeaderData = {
      title: "income details and loan offer",
      steps: [
        {
          title: "Income details",
          status: "init",
        },
        {
          title: "Loan offer",
          status: "pending",
        },
      ],
    };

    if (vendor_info.bt_eligible) {
      progressHeaderData.steps.splice(1, 0, {
        title: "Balance transfer details",
        status: "pending",
      });
    }

    this.setState({
      progressHeaderData: progressHeaderData,
      employment_type: application_info.employment_type || "",
    });
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
        submit: {
          // handleClick1: this.handleClick,
          button_text1: "Dismiss",
          title1: this.state.title1,
          handleClick1: () => {
            this.setState({
              showError: false,
            });
          },
          // button_text2: "Edit",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  sendEvents(user_action, data = {}) {
    let details = {
      netbanking: "fetch details using netbanking",
      manual_upload: "upload bank statement",
    };
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_income_details_perfios",
      properties: {
        user_action: user_action,
        option_selected: details[data.option_selected] || "",
        event_name: "idfc_income_details_perfios",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = (transaction_type) => {
    this.sendEvents("next", { option_selected: transaction_type });
    this.startTransaction(transaction_type);
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Income details"
        noFooter={true}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="income-details">
          <div className="subtitle">
            Provide bank statements of your
            {this.state.employment_type === "self_employed"
              ? " savings or current account "
              : " salary account "}
            for income assessment in <b>just 2 clicks! </b>
            {this.state.employment_type === "self_employed" &&
              "Best if you can provide your current account statements."}
          </div>
          <Card withtag="true" onClick={() => this.handleClick("netbanking")}>
            <div className="card-content" style={{ padding: "10px 0 0" }}>
              <img
                src={require(`assets/${this.state.productName}/mobile_credit_card.svg`)}
                alt=""
              />
              <div
                style={{ width: !getConfig().isMobileDevice ? "85%" : "77%" }}
              >
                <div className="title">Fetch details using net banking</div>
                <div className="sub-title">
                  Preferred, secure and hassle-free way of verifying income. Net
                  banking credentials are never stored.
                </div>
              </div>
            </div>
          </Card>

          <div className="OR">
            <div className="generic-hr"></div>
            OR
            <div className="generic-hr"></div>
          </div>

          <Card onClick={() => this.handleClick("manual_upload")}>
            <div className="card-content">
              <img
                src={require(`assets/${this.state.productName}/register_icn.svg`)}
                alt=""
              />
              <div
                style={{ width: !getConfig().isMobileDevice ? "85%" : "77%" }}
              >
                <div className="title">Upload bank statement PDFs</div>
                <div className="sub-title">
                  Attach e-statements downloaded from bank's website or the ones
                  you've received from bank on email.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    );
  }
}

export default IncomeDetails;
