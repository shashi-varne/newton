import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize, getContact } from "../common/functions";
import Api from "utils/api";
import toast from "../../common/ui/Toast";

class WhastappConfirmNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // show_loader: false,
      screen_name: "confirm_number"
    };

    this.initialize = initialize.bind(this);
    this.getContact = getContact.bind(this);
  }

  componentWillMount() {
    this.initialize();
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
    this.sendEvents("edit");
    this.navigate("edit-number", {
      params: {
        mobile: this.state.mobile,
      },
    });
  };

  handleClick = async () => {
    this.sendEvents("next");

    let id = this.state.contact_id;

    if (!id) {
      id = await this.getContact();
    }

    if (id) {
      let body = {
        contact_id: id,
        consent: true,
        communication_type: "whatsapp",
      };

      try {
        this.setState({
          show_loader: true,
        });
        const res = await Api.post(
          // `/api/communication/contact/consent?user_id=${this.state.user_id}`,
          `/api/communication/contact/consent`,
          body
        );
        let resultData = res.pfwresponse.result || {};

        if (res.pfwresponse.status_code === 200 && !resultData.error) {
          this.setState({
            show_loader: true,
          });

          this.navigate("otp-success");
        } else {
          this.setState({
            show_loader: false,
          });
          toast(
            resultData.error || resultData.message || "Something went wrong"
          );
        }
      } catch (err) {
        this.setState({
          show_loader: false,
          // openDialog: true,
        });
        toast("Something went wrong");
      }
    }
  };

  render() {
    let { show_loader } = this.state;
    let mobile = this.state.mobile || "";
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
