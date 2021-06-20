import React, { Component } from "react";
import WVClickableTextElement from "../common/ui/ClickableTextElement/WVClickableTextElement";
import Container from "../dashboard/common/Container";
import { initialize } from "./function";
import OtpComp from "./otp/reset_opt";
import "./Otp.scss";

export class OtpSecondary extends Component {
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
    // if (!state || !state.mobile_number) {
    //   toast("Mobile number not provided");
    //   this.props.history.goBack();
    //   return;
    // }
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
  handleOtp = (otp) => {
    this.setState({
      otpData: { ...this.state.otpData, otp },
    });
  };
  resendOtpVerification = () => {
    console.log("RESEND OTP");
  };



  handleClick = () => {

    console.log(this.state.mobile_number, this.state.otpData, this.state.otp_id);

    this.otpVerification({
      mobile_number: this.state.mobile_number,
      otp_value: this.state.otpData["otp"],
      otp_id: this.state.otp_id,
    });
  };



  render() {
    let showDotLoader = false;
    let communicationType = "email";
    return (
      <Container
        title={`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"
          }`}
        buttonTitle="VERIFY"
        canSkip={true}
        onSkipClick={() => this.navigate("/")}
        handleClick={() => this.handleClick()}
      >
        <div className="verify-otp-container verify-otp-container-secondary">
          <div className="verify-otp-header">
            <p>
              An OTP has been sent to{" "}
              <span style={{ fontWeight: "500", marginRight: "23px" }}>uttampaswan@fisdom.com</span>
            </p>
            <WVClickableTextElement onClick={() => this.props.history.goBack()}>EDIT</WVClickableTextElement>
          </div>
          <div className="kcd-otp-content">
          <OtpComp
            otpData={this.state.otpData}
            showDotLoader={showDotLoader}
            handleOtp={this.handleOtp}
            resendOtp={this.resendOtp}
          />
          </div>
        </div>
      </Container>
    );
  }
}

export default OtpSecondary;
