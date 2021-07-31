import React, { Component } from "react";
import Container from "../../../dashboard/common/Container";
import { navigate as navigateFunc } from "utils/functions";
import { otpVerification, resendOtp, redirectAfterLogin } from "../../functions";
import "./secondaryVerification.scss";
import { toast } from "react-toastify";
import OtpContainer from "../../../common/components/OtpContainer";
import { formatMobileNumber } from "utils/validators";
import { nativeCallback } from "../../../utils/native_callback";

export class SecondaryOtpVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      isApiRunning: false,
      otpData: {
        totalTime: 15,
        timeAvailable: 15,
      },
      communicationType: "mobile",
      showDotLoader: false
    };
    this.otpVerification = otpVerification.bind(this);
    this.resendOtp = resendOtp.bind(this);
    this.redirectAfterLogin = redirectAfterLogin.bind(this);
    this.navigate = navigateFunc.bind(this.props);
  }

  componentWillMount() {
    let { state } = this.props.location || {};
    if (!state) {
      toast("Mobile number not provided");
      this.props.history.goBack();
      return;
    }
    let { value, otp_id, communicationType } = state;
    let rebalancing_redirect_url = state.rebalancing_redirect_url || false;
    this.setState({
      value: value,
      otp_id: otp_id,
      rebalancing_redirect_url: rebalancing_redirect_url,
      communicationType: communicationType
    });
  }

  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
    });
  };


  handleClick = () => {
    this.otpVerification({
      otp_value: this.state.otpData["otp"],
      otp_id: this.state.otp_id,
    });
  };

  secondaryOtpNavigate = () => {
    this.sendEvents("edit")
    this.navigate('/secondary-verification', {
      state: {
        communicationType: this.state.communicationType,
        contactValue: this.state.value,
        edit: true,
      }
    })
  }

  handleResendOtp = () => {
    this.resendOtp(this.state.otp_id)
    this.setState({
      otpData: { ...this.state.otpData, timeAvailable: 15, },
    });
  }

  sendEvents = (userAction) => {
    let properties = {
      "otp_entered": userAction === "next" ? "yes" : "no",
      "mode_entry": "manual",
      "user_action": userAction,
      "screen_name": `${this.state.communicationType}_otp`,
    }
    let eventObj = {
      "event_name": 'onboarding',
      "properties": properties,
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  render() {
    const { isResendOtpApiRunning, communicationType, value, isWrongOtp, otpData } = this.state;
    return (
      <Container
        title={`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"}`}
        events={this.sendEvents('just_set_events')}
        buttonTitle="VERIFY"
        disable={otpData.otp?.length === 4 ? false : true}
        showLoader={this.state.isApiRunning}
        canSkip={true}
        onSkipClick={() => {
          this.navigate("/");
          this.sendEvents("skip");
        }}
        handleClick={this.handleClick}
      >
        <OtpContainer
          handleClickText={"EDIT"}
          handleClick={this.secondaryOtpNavigate}
          classes={{
            body: "verify-otp-container-secondary"
          }}
          otpData={otpData}
          showDotLoader={isResendOtpApiRunning}
          handleOtp={this.handleOtp}
          resendOtp={this.handleResendOtp}
          isWrongOtp={isWrongOtp}
          bottomText={isWrongOtp ? "Invalid OTP" : ""}
          value={communicationType !== "email" ? formatMobileNumber(value) : value}>
        </OtpContainer>
      </Container>
    );
  }
}

export default SecondaryOtpVerification;