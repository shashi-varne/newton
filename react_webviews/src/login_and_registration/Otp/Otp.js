import React, { Component } from "react";
import "../commonStyles.scss";
import { initialize } from "../function";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
// import { validateNumber } from "../../utils/validators";
import OtpComp from "./reset_opt";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import WVButton from "../../common/ui/Button/WVButton";
import LoginContainer from "../Login/LoginContainer"

const config = getConfig();
const isMobileView = config.isMobileDevice;
// const productName = config.productName;
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
      user_whatsapp_consent: this.state.user_whatsapp_consent,
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
    let loginType = communicationType === "email" ? "email" : "mobile";
    let showDotLoader = false;
    return (
      <LoginContainer>
        <div className="verify-otp-container">
          <p className="title">{`Enter OTP to verify your ${loginType === "email" ? "email" : "number"
            }`}</p>
          <div className="verify-otp-header">
            <p>
              An OTP has been sent to{" "}
              <span style={{ fontWeight: "500", marginRight: "23px" }}>
                {this.state.mobile_number}
              </span>
            </p>
          </div>
          <div className="kcd-otp-content">
            <OtpComp
              otpData={this.state.otpData}
              showDotLoader={showDotLoader}
              handleOtp={this.handleOtp}
              resendOtp={this.resendLoginOtp}
              isWrongOtp={isWrongOtp}
              resend_url={this.state.resend_url}
            />
          </div>
          <div>
            <WVButton
              variant='contained'
              size='large'
              color="secondary"
              onClick={this.handleClick}
              disabled={false}
              showLoader={isApiRunning}
              fullWidth
              className={isMobileView ? "login-otp-button login-otp-button-mobile" : "login-otp-button login-otp-button-web"}
            >
              CONTINUE
            </WVButton>
          </div>
          <WVClickableTextElement onClick={() => this.props.history.goBack()}>
            <p className="go-back-to-login">GO BACK TO LOGIN</p>
          </WVClickableTextElement>
        </div>
      </LoginContainer>
    );
  }
}

export default Otp;