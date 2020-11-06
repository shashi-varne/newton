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
      points: ["Photo Identity Proof", "Address Proof", "Income Proof"],
    };

    const content2 = {
      "sub-head": "For Self-employed Applicants",
      points: [
        "Photo Identity Proof",
        "Address Proof",
        "Business Proof",
        "Income Proof",
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
        buttonTitle={this.state.cta_title}
        count={true}
        current={3}
        total={4}
        noFooter={true}
        headerData={{
          icon: "close",
        }}
      >
        <div className="check-gold-price">
          <img
            className="img"
            src={require(`assets/${this.state.productName}/ils_hassle_free.svg`)}
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
