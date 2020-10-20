import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../common/functions";
import Input from "../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import { numberShouldStartWith, validateNumber } from "utils/validators";
import Api from "utils/api";
import toast from "../../common/ui/Toast";

class WnatsappEditNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {

    let { params } = this.props.location;
    if (!params) {
      params = {};
    }

    let mobile = params.mobile || "";
    this.setState({
      mobile_no: mobile,
    }, () => {
      this.initialize();
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: "edit mobile number",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ event: eventObj });
    }
  }

  handleChange = (name) => (event) => {
    let value = event.target.value;
    let mobile = value.slice(4);

    if (mobile && !validateNumber(mobile)) {
      return;
    }

    if (value.length > 14) {
      return;
    }

    this.setState({
      mobile_no: mobile,
      mobile_no_error: "",
    });
  };

  handleClick = async () => {
    this.sendEvents("next");
    let canProceed = true;
    let mobile = this.state.mobile_no;

    if (
      mobile.length !== 10 ||
      !validateNumber(mobile) ||
      !numberShouldStartWith(mobile)
    ) {
      canProceed = false;
      this.setState({
        mobile_no_error: "Please enter valid mobile no.",
      });
    }

    if (canProceed) {
      let body = {
        mobile: mobile,
      };
      try {
        this.setState({
          show_loader: true,
        });

        let res = await Api.post("/api/communication/send/otp", body);

        var resultData = res.pfwresponse.result;

        if (res.pfwresponse.status_code === 200 && !resultData.error) {
          let otp_id = resultData.otp_id || "";
          this.navigate("otp-verify", {
            params: {
              otp_id: otp_id,
              mobile: mobile,
            },
          });
          toast("An OTP send to your mobile number");
        } else {
          this.setState({
            show_loader: false,
          });
          toast(resultData.error || resultData.message || "Something went wrong");
        }

      } catch (err) {
        this.setState({
          show_loader: false,
        });
        toast("Something went wrong");
      }
    }
  };

  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="WhatsApp mobile number"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        disable={this.state.mobile_no.length !== 10}
        buttonTitle="CONTINUE"
      >
        <div className="whatsapp-edit-number">
          <div className="whatsapp-content">
            Confirm your WhatsApp mobile number to get the latest updates about
            your account
          </div>

          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.mobile_no_error}
                helperText={this.state.mobile_no_error}
                type="text"
                width="40"
                label="Enter mobile number"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={"+91 " + this.state.mobile_no || ""}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default WnatsappEditNumber;
