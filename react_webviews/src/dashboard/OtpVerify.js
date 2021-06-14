import React, { Component } from "react";
import WVClickableTextElement from "../common/ui/ClickableTextElement/WVClickableTextElement";
import Container from "./common/Container";
import Otp from "../kyc/Equity/mini-components/Otp";
import "./OtpVerify.scss";

export class OtpVerify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otpData: {
        totalTime: 15,
        timeAvailable: 15,
      },
    };
  }

  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
    });
  };
  resendOtpVerification = () => {
    console.log("RESEND OTP");
  };
  render() {
    let showDotLoader = false;
    let communicationType = "email";
    return (
      <Container
        title={`Enter OTP to verify your ${
          communicationType === "email" ? "email" : "number"
        }`}
        buttonTitle="VERIFY"
        handleClick={() => console.log("VERIFY")}
      >
        <div className="verify-otp-container">
          <div className="verify-otp-header">
            <p>
              An OTP has been sent to{" "}
              <span style={{ fontWeight: "500", marginRight: "23px" }}>uttampaswan@fisdom.com</span>
            </p>
            <WVClickableTextElement>EDIT</WVClickableTextElement>
          </div>
          <div className="kcd-otp-content">
            <Otp
              otpData={this.state.otpData}
              showDotLoader={showDotLoader}
              handleOtp={this.handleOtp}
              resendOtp={this.resendOtpVerification}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default OtpVerify;
