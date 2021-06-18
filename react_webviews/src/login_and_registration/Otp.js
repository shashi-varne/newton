import React, { Component } from "react";
import "./Style.scss";
import { initialize } from "./function";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
import { validateNumber } from "../utils/validators";
import OtpComp from "../kyc/Equity/mini-components/Otp";
import WVClickableTextElement from "../common/ui/ClickableTextElement/WVClickableTextElement";
import WVButtonLayout from "../common/ui/ButtonLayout/WVButtonLayout";

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
    let mobile_number = state.mobile_number;
    let rebalancing_redirect_url = state.rebalancing_redirect_url || false;
    let forgot = state.forgot;
    this.setState({
      mobile_number: mobile_number,
      rebalancing_redirect_url: rebalancing_redirect_url,
      forgot: forgot,
    });
    this.initialize();
  }

  handleClick = () => {
    this.otpVerification({
      mobile_number: this.state.mobile_number,
      otp: this.state.otpData["otp"],
    });
  };

  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
    });
  };

  render() {
    let { isApiRunning, otpData } = this.state;
    let disabled = otpData.otp?.length !== 4;
    let communicationType = "mobile";
    let showDotLoader = false;
    return (
      <div className="verify-otp-container">
        <p className="title">{`Enter OTP to verify your ${
          communicationType === "email" ? "email" : "number"
        }`}</p>
        <div className="verify-otp-header">
          <p>
            An OTP has been sent to{" "}
            <span style={{ fontWeight: "500", marginRight: "23px" }}>
              {this.state.mobile_number}
            </span>
          </p>
          <WVClickableTextElement>EDIT</WVClickableTextElement>
        </div>
        <div className="kcd-otp-content">
          <OtpComp
            otpData={this.state.otpData}
            showDotLoader={showDotLoader}
            handleOtp={this.handleOtp}
            resendOtp={this.resendOtp}
          />
        </div>
        <div>
          <WVButtonLayout.Button
            type="primary"
            title="VERIFY"
            onClick={this.handleClick}
            // disable={disabled}
            showLoader={isApiRunning}
            className={isMobileView ? "login-otp-button login-otp-button-mobile" : "login-otp-button"}
          />
        </div>
      </div>
    );
  }
}

export default Otp;
