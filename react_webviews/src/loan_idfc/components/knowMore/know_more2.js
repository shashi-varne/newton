import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class KnowMore2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "knowmore2_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    const content1 = {
      "sub-head": "For Salaried Applicants",
      points: [
          "Must be earning a minimum net monthly salary of Rs. 20,000",
          "Should at least be 23 years of age",
          "Maximum age at the time of loan maturity should not be more than 60 years",
      ],
    };

    const content2 = {
      "sub-head": "For Self-employed Applicants",
      points: [
        "Should at least be 23 years of age",
        "Maximum age at the time of loan maturity should not be more than 65 years",
        "Business must be in operations for at least 3 years",
        "You must be managing your business from the same office premises for at least a year",
      ],
    };

    this.setState({
      content1: content1,
      content2: content2,
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
        buttonTitle="APPLY NOW"
        arrow={true}
        count={true}
        current={2}
        total={4}
        LeftRightCtaButton={true}
        headerData={{
          icon: "close",
        }}
      >
        <div className="check-gold-price">
          <img
            className="img"
            src={require(`assets/${this.state.productName}/ils_alternate_gold.svg`)}
            alt=""
          />

          <div className="title">Documents Required</div>
          <div className="content">
            <div className="sub-head">{this.state.content1["sub-head"]}</div>
            <div className="points">
              {this.state.content1.points.map((item, index) => (
                <div className="sub-pts" key={index}>
                  <span className="count">{index + 1 + "."}</span>
                  <span className="subtitle">{item}</span>
                </div>
              ))}
            </div>

            <div className="sub-head">{this.state.content2["sub-head"]}</div>
            <div className="points">
              {this.state.content2.points.map((item, index) => (
                <div className="sub-pts" key={index}>
                  <span className="count">{index + 1 + "."}</span>
                  <span className="subtitle">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default KnowMore2;
