import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import OtpDefault from "../../../common/ui/otp";
import { getConfig } from "utils/functions";
import { verifyOtp, retriggerOtp } from "../../common/ApiCalls";
import toast from '../../../common/ui/Toast';

class OtpVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      otpnumber: "",
      otpnumber_error: "",
      otpVerified: false,
      otp: "",
      timeAvailable: 30,
      totalTime: 30,
      otpBaseData: {},
      proceedForOrder: false,
      base_url: getConfig().base_url,
      screen_name: "otp_verify",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;

    if (!params) {
      this.props.history.goBack();
      return;
    }

    this.setState({
      ...params,
    });
  }

  onload = () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "otp",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleOtp = (otp) => {
    this.setState({
      otp: otp,
      otp_error: "",
    });
  };

  resendOtp = async () => {
    let { resend_otp_url: url } = this.state;
    this.setState({
      show_loader: true,
      otp_error: "",
      otp: "",
      timeAvailable: this.state.totalTime,
      resend_otp_clicked: true,
      openDialog: false,
    });

    const resultData = await retriggerOtp(url);

      if (resultData) {
        toast('OTP is resend to your registered mobile number')
        this.setState({
          show_loader: false,
        });
      }
  };

  handleClick = async () => {
    this.sendEvents("next");
    let canSubmitForm = true;

    let { verify_otp_url: url, otp } = this.state;

    if (!this.state.otp) {
      canSubmitForm = false;
      this.setState({
        otp_error: "Please enter OTP",
      });
      return;
    }

    if (this.state.otp.length !== 4) {
      canSubmitForm = false;
      this.setState({
        otp_error: "OTP is a 4 digit number",
      });
      return;
    }

    if (canSubmitForm) {
      this.setState({
        show_loader: true,
      });

      let params = {
        otp: otp,
      };

      const resultData = await verifyOtp(url, params);

      if (resultData) {
        this.setState({
          show_loader: false,
        });
        this.navigate(this.state.next_state);
      }
    }
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Otp verification"
        buttonTitle="VERIFY & PROCEED"
        disable={this.state.otp.length !== 4}
        handleClick={this.handleClick}
      >
        <div className="otp-verification">
          <div className="subtitle">
            Enter OTP sent to <b>+91{this.state.mobile_no}</b>
          </div>

          <OtpDefault parent={this} />
        </div>
      </Container>
    );
  }
}

export default OtpVerification;
