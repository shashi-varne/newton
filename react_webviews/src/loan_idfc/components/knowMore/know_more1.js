import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { Bar } from "react-chartjs-2";
import { inrFormatDecimal2 } from "utils/validators";
import { getConfig } from "utils/functions";

class KnowMore1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      cta_title: "APPLY NOW",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    // - For salaried, the range is from Rs. 1 lakh to
    //  40 lakhs
    // - For self-employed the max loan amount is
    //  Rs. 9 lakhs

    const content = [
      "Loan up to 40 lakhs:",
      "Low interest rate starting at 10.75% p.a.",
      "Flexible loan tenure -- min 12 months, max 60 months",
      "Option of ‘balance transfer’ at attractive rates",
      "Loan sanction in less than 4 hrs",
      "100% digital with easy documentation",
      "Top-up facility to avail extra funds on the existing loan",
    ];

    this.setState({
      content: content,
    });
  }

  onload = async () => {};

  handleClick = () => {};

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "know_more",
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
        title="Get an instant personal loan"
        buttonTitle={this.state.cta_title}
        count={true}
        current={1}
        total={4}
        headerData={{
          icon: "close",
        }}
      >
        <div className="check-gold-price">

          <div className="title">Features and Benefits</div>
          <div className="content">
            {this.state.content.map((item, index) => (
              <div className="sub-pts" key={index}>
                <span className="count">{index + 1 + "."}</span>
                <span className="subtitle">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }
}

export default KnowMore1;
