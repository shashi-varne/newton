import React, { Component } from "react";
import "./commonStyles.scss";
import { initialize } from "../../functions";
import toast from "common/ui/Toast";
import WVButton from "../../../common/ui/Button/WVButton";
import LoginContainer from "./LoginContainer"
import OtpContainer from "../../common/OtpContainer";
class Otp extends Component {
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
    let { value, otp_id, communicationType, verify_url, resend_url, user_whatsapp_consent } = state;
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
    if (user_whatsapp_consent) body.user_whatsapp_consent = true;

    this.setState(body);
    this.initialize();
  }

  handleClick = () => {
    let body = {
      otp: this.state.otpData["otp"],
      user_whatsapp_consent: this.state.user_whatsapp_consent || "",
    }
    this.otpLoginVerification(this.state.verify_url, body);
  };

  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
    });
  };

  render() {
    let { isApiRunning, otpData, isWrongOtp, communicationType } = this.state;
    let disabled = otpData.otp?.length !== 4;
    let showDotLoader = false;
    return (
      <LoginContainer>
        <OtpContainer
          title={`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"}`}
          otpData={this.state.otpData}
          showDotLoader={showDotLoader}
          handleOtp={this.handleOtp}
          resendOtp={this.handleResendOtp}
          isWrongOtp={isWrongOtp}
          value={this.state.otpData.otp}
          classes={{
            subtitle: "login-subtitle"
          }}
        >
          <WVButton
            variant='contained'
            size='large'
            color="secondary"
            onClick={this.handleClick}
            disabled={disabled}
            showLoader={isApiRunning}
            fullWidth
            className="login-button"
          >
            CONTINUE
            </WVButton>
          <WVButton classes={{ label: 'go-back-to-login', }} style={{ margin: "40px auto 0px" }} onClick={() => this.props.history.goBack()}>
            Go Back to Login
          </WVButton>
        </OtpContainer>
      </LoginContainer>
    );
  }
}

export default Otp;