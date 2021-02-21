import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { inrFormatDecimal } from "utils/validators";
import dmi_logo from "assets/dmi_logo.svg";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ["vendor_info"],
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      application_info: application_info,
      vendor_info: vendor_info,
    });
  };

  handleClick = (card_name) => {
    this.sendEvents("next", { card: card_name });
  };

  sendEvents(user_action, data={} ) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "loan report",
        card_click: data.card
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let vendor_info = this.state.vendor_info || {};
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        noFooter={true}
        classHeader="loan-report-header"
        classOverRide={'loanMainContainer'}
      >
        <div className="loan-landing2">
          <div className="container">
            <div style={{ lineHeight: "24px" }}>
              <div className="closing-principle">
                Closing principle balance
              </div>
              <div className="principle-balance">
                {inrFormatDecimal(vendor_info.closing_principal_balance)}
              </div>
            </div>

            <div className="block1">
              <div style={{ lineHeight: "24px" }}>
                <div className="block1-head">Loan amount</div>
                <div className="block1-amount">
                  {inrFormatDecimal(vendor_info.approved_amount_final)}
                </div>
              </div>
              <div style={{ lineHeight: "24px" }}>
                <div className="block1-head">Upcoming EMI</div>
                <div className="block1-amount">
                  {inrFormatDecimal(vendor_info.emi_amount)}
                  <span style={{ color: "#7ED321", fontSize: "12px" }}>
                    {" "}
                    ({vendor_info.dt_next_payment})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="block2" onClick={() => {
            this.handleClick('loan schedule document')
            this.navigate("schedule-Doc")
          }}>
            <div className="card-info">
              <img
                src={require(`assets/${this.state.productName}/ic_loan_schedule.svg`)}
                style={{ marginRight: 10 }}
                alt=""
              />
              Get loan schedule document
            </div>
          </div>

          <div
            className="block2"
            onClick={() => {
              this.handleClick('customer portal')
              this.openInBrowser("https://portal.dmifinance.in/");
            }}
          >
            <div className="card-info">
              <img
                src={require(`assets/${this.state.productName}/ic_customer_portal.svg`)}
                style={{ marginRight: 10 }}
                alt=""
              />
              DMI customer portal
            </div>
          </div>

          <div className="block2" onClick={() => {
            this.handleClick('help')
            this.navigate("help")
          }}>
            <div className="card-info">
              <img
                src={require(`assets/${this.state.productName}/ic_help.svg`)}
                style={{ marginRight: 10 }}
                alt=""
              />
              Need help
            </div>
          </div>

          <div className="dmi-info">
            In partnership with
            <img style={{ marginLeft: 10 }} src={dmi_logo} alt="" />
          </div>
        </div>
      </Container>
    );
  }
}

export default Report;
