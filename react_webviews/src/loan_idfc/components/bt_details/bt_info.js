import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class BtInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleClick = () => {};

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "income_details",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        buttonTitle="OPTING FOR BT"
      >
        <div className="bt-info">
          <div className="head">How does BT work?</div>
          <div className="sub-head">
            A 'balance transfer' is a unique feature that allows you to transfer
            the outstanding principal amount of your existing personal loans or
            credit cards (taken from other lenders) to IDFC FIRST Bank (if any).
          </div>
          <div className="head">What benefits will I get?</div>
          <div className="benefits">
            <img
              src={require(`assets/${this.state.productName}/bt_1.svg`)}
              alt=""
            />
            <div className="sub-benefits">
              Lower interest rate compared to your existing loan(s)
            </div>
          </div>
          <div className="benefits">
            <img
              src={require(`assets/${this.state.productName}/bt_2.svg`)}
              alt=""
            />
            <div className="sub-benefits">
              An option to choose a longer loan repayment tenure
            </div>
          </div>
          <div className="benefits">
            <img
              src={require(`assets/${this.state.productName}/bt_3.svg`)}
              alt=""
            />
            <div className="sub-benefits">
              Possibility of getting a bigger loan offer depending on your
              profile{" "}
            </div>
          </div>
          <div className="head">
            What information do I need to provide for BT?
          </div>
          <div className="benefits">
            <img
              src={require(`assets/${this.state.productName}/icon_color.svg`)}
              alt=""
            />
            <div className="sub-benefits">
              Outstanding principal amount of existing loan(s) or credit card(s)
            </div>
          </div>
          <div className="benefits">
            <img
              src={require(`assets/${this.state.productName}/icon_color.svg`)}
              alt=""
            />
            <div className="sub-benefits">
              Account statement of the existing loan(s) for which you want to
              avail ‘balance transfer’
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default BtInformation;
