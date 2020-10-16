import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import Whatsapp from "..";

class WhatsappOtpFailed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
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

  render() {
      return (
          <Container
            show_loader={this.state.show_loader}
          >
              
          </Container>
      )
  }
}

export default WhatsappOtpFailed;
