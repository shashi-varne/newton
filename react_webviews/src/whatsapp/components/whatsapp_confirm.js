import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize, summary } from "../common/functions";

class WhastappConfirmNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // show_loader: false,
    };

    this.initialize = initialize.bind(this);
    this.summary = summary.bind(this);
  }

  componentWillMount() {
    this.initialize();
    this.summary();

    let { params } = this.props.location;

    if (!params) {
      params = {};
    }

    this.setState({
      params_mobile: params.mobile || ""
    })
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: "confirm mobile number",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleEdit = () => {
    this.sendEvents("edit")
    this.navigate("edit-number", {
      params: {
        mobile: this.state.mobile,
      },
    });
  };

  handleClick = () => {
    this.sendEvents("next")

    if (this.state.verified) {
      this.navigate("otp-success", {
        params: {
          mobile: this.state.params_mobile || this.state.mobile,
        },
      });
    } else {
      this.navigate("whatsapp-edit", {
        params: {
          mobile: this.state.params_mobile || this.state.mobile,
        },
      });
    }
    
  }

  render() {
    let { show_loader } = this.state;
    let mobile = this.state.params_mobile || this.state.mobile || '';

    let ui_mobile;

    if (!show_loader && mobile) {
      ui_mobile =
        " " +
        mobile.slice(0, 3) +
        " " +
        mobile.slice(3, 6) +
        " " +
        mobile.slice(6);
    }

    return (
      <Container
        showLoader={this.state.show_loader}
        title="WhatsApp mobile number"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="CONFIRM"
        headerData={{
          icon: "close",
        }}
      >
        <div className="whatsapp-confirm-mobile">
          <div className="whatsapp-content">
            Tap on confirm to proceed further or click on edit to change your
            WhatsApp number
          </div>

          <div className="mobile-content">
            <div className="code">
              +91
              <span className="number">{ui_mobile}</span>
              <span className="edit-number" onClick={this.handleEdit}>
                EDIT
              </span>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default WhastappConfirmNumber;
