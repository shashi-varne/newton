import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize, getContact } from "../common/functions";
import Api from "utils/api";
import toast from "../../common/ui/Toast";
import { storageService } from "utils/validators";

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

    this.setState({
      mobile_no: params.mobile || "",
      contact_id: params.contact_id || ""
    }, () => {
      storageService().set('mobile', params.mobile)
    });
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

  handleClick = async () => {
    this.sendEvents("next");

    let id = (!this.state.contact_id && await this.getContact()) || this.state.contact_id;

    if (id) {
      let body = {
        contact_id: id,
        consent: true,
        communication_type: "whatsapp"
      }
      
      try {
        this.setState({
          show_loader: true,
        });
        const res = await Api.post(
          `/api/communication/contact/consent?user_id=${this.state.user_id}`,
          body
        );
        let resultData = res.pfwresponse.result || {};

        if (res.pfwresponse.status_code === 200 && !resultData.error) {
          this.setState({
            show_loader: true,
          });
          nativeCallback({ action: "native_back" });
        } else {

          this.setState({
            show_loader: false,
          });
          toast(resultData.error || resultData.message || "Something went wrong");
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
    return (
      <Container
        showLoader={this.state.show_loader}
        title=""
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="OK"
        mobile_no={this.state.mobile_no}
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
