import React, { Component } from "react";
import "../Style.scss";
import { initialize } from "../function";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
// import { validateNumber } from "../../utils/validators";
import OtpComp from "./reset_opt";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import WVButtonLayout from "../../common/ui/ButtonLayout/WVButtonLayout";
import LoginContainer from "../LoginContainer"

const config = getConfig();
const isMobileView = config.isMobileDevice;
const productName = config.productName;
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
    if (!state || !state.mobile_number) {
      toast("Mobile number not provided");
      this.props.history.goBack();
      return;
    }
    let { mobile_number, otp_id } = state;
    let rebalancing_redirect_url = state.rebalancing_redirect_url || false;
    let forgot = state.forgot;
    this.setState({
      mobile_number: mobile_number,
      otp_id: otp_id,
      rebalancing_redirect_url: rebalancing_redirect_url,
      forgot: forgot,
    });
    this.initialize();
  }

  handleClick = () => {
    this.otpVerification({
      mobile_number: this.state.mobile_number,
      otp_value: this.state.otpData["otp"],
      otp_id: this.state.otp_id,
    });
  };

  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
    });
  };

  render() {
    let { isApiRunning, otpData, isWrongOtp } = this.state;
    let disabled = otpData.otp?.length !== 4;
    let communicationType = "mobile";
    let showDotLoader = false;
    return (
      <LoginContainer>
        <div className="verify-otp-container">
          <p className="title">{`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"
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
              resendOtp={this.resendOtp}
              isWrongOtp={isWrongOtp}
              otp_id={this.state.otp_id}
            />
          </div>
          <div>
            <WVButtonLayout.Button
              type="primary"
              title="CONTINUE"
              onClick={this.handleClick}
              disable={disabled}
              showLoader={isApiRunning}
              className={isMobileView ? "login-otp-button login-otp-button-mobile" : "login-otp-button login-otp-button-web"}
            />
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