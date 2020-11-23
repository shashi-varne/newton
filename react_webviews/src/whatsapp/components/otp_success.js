import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize, getContact } from "../common/functions";

class WhatsappOtpSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };

    this.initialize = initialize.bind(this);
    this.getContact = getContact.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;
    if (!params) {
      params = {};
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: "link successful",
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

    nativeCallback({ action: "exit_web" });
  
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title=""
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="OK"
        mobile_no={this.state.mobile_no}
        headerData={{
          icon: "close",
        }}
      >
        <div className="otp-success center">
          <img
            src={require(`assets/${this.state.productName}/whatsapp.svg`)}
            alt=""
          />

          <div className="head">WhatsApp linked!</div>
          <div className="sub-head">
            Congratulations! You will now recieve {this.state.productName}’s
            notifications & updates on Whatsapp. To stop recieving updates, go
            to profile & disable.
          </div>
        </div>
      </Container>
    );
  }
}

export default WhatsappOtpSuccess;
