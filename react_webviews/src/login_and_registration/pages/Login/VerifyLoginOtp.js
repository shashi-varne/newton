import './commonStyles.scss';
import React, { Component } from "react";
import { initialize } from "../../functions";
import toast from "common/ui/Toast";
import OtpContainer from '../../../common/components/OtpContainer';
import LoginButton from '../../common/LoginButton';
import GoBackToLoginBtn from '../../common/GoBackToLoginBtn';
import { nativeCallback } from "../../../utils/native_callback";
import { formatMobileNumber } from '../../../utils/validators';

class VerifyLoginOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      isApiRunning: false,
      otpData: {
        totalTime: 15,
        timeAvailable: 15,
      },
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    let { state } = this.props.location || {};
    if (!state) {
      toast("Mobile number not provided");
      this.props.history.goBack();
      return;
    }
    let { value, otp_id, communicationType, verify_url, resend_url } = state;
    let rebalancing_redirect_url = state.rebalancing_redirect_url || false;
    let forgot = state.forgot;
    let body = {
      value,
      otp_id,
      rebalancing_redirect_url,
      forgot,
      communicationType,
      verify_url,
      resend_url
    }

    this.setState(body);
    this.initialize();
  }

  handleClick = (event) => {
    let body = {
      otp: this.state.otpData["otp"],
    }
    this.otpLoginVerification(this.state.verify_url, body);
    event.preventDefault()
  };

  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
      isWrongOtp: false,
    });
  };

  handleResendOtp = () => {
    this.resendLoginOtp(this.state.resend_url)
    this.sendEvents("resend");
    this.setState({
      otpData: {
        ...this.state.otpData,
        timeAvailable: 15,
        otp: ''
      },
      isWrongOtp: false,
    });
  }

  sendEvents = (userAction) => {
    let properties = {
      "screen_name": `${this.state.communicationType}_otp`,
      "user_action": userAction,
      "otp_entered": this.state.otpData.otp?.length === 4 ? "yes" : "no",
      "mode_entry": "manual",
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

  goBackToLogin = () => {
    this.sendEvents("back");
    this.props.history.goBack();
  }

  render() {
    let { value, isApiRunning, otpData, isWrongOtp, communicationType, isResendOtpApiRunning } = this.state;
    let disabled = otpData.otp?.length !== 4;
    return (
      <form onSubmit={this.handleClick}>
        <OtpContainer
          title={`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"}`}
          otpData={this.state.otpData}
          showDotLoader={isResendOtpApiRunning}
          handleOtp={this.handleOtp}
          resendOtp={this.handleResendOtp}
          isWrongOtp={isWrongOtp}
          value={communicationType !== "email" ? formatMobileNumber(value) : value}
          classes={{
            subtitle: "login-subtitle"
          }}
        >
          <LoginButton
            onClick={this.handleClick}
            disabled={disabled}
            showLoader={isApiRunning}
            type="submit"
          >
            CONTINUE
          </LoginButton>
          <GoBackToLoginBtn
            onClick={this.goBackToLogin}
            disabled={isApiRunning || isResendOtpApiRunning}
          />
        </OtpContainer>
      </form>
    );
  }
}

export default VerifyLoginOtp;