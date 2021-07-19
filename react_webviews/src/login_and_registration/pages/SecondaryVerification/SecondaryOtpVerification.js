import React, { Component } from "react";
import WVClickableTextElement from "../../../common/ui/ClickableTextElement/WVClickableTextElement";
import Container from "../../../dashboard/common/Container";
import { initialize } from "../../functions";
import OtpComp from "../Otp/reset_opt";
import "./secondaryStyle.scss";
import { toast } from "react-toastify";

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
    this.initialize = initialize.bind(this);
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
    this.initialize();
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



  render() {
    const { showDotLoader, communicationType, otp_id } = this.state;
    return (
      <Container
        title={`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"
          }`}
        buttonTitle="VERIFY"
        showLoader={this.state.isApiRunning}
        canSkip={true}
        onSkipClick={() => this.navigate("/")}
        handleClick={() => this.handleClick()}
      >
        <div className="verify-otp-container verify-otp-container-secondary">
          <div className="verify-otp-header">
            <p>
              An OTP has been sent to{" "}
              <span style={{ fontWeight: "500", marginRight: "23px" }}>{this.state.value}</span>
            </p>
            <WVClickableTextElement onClick={() => this.navigate('/secondary-verification', {
              state: {
                communicationType: communicationType,
                contactValue: this.state.mobile_number
              }
            })}>EDIT</WVClickableTextElement>
          </div>
          <div className="kcd-otp-content">
            <OtpComp
              otpData={this.state.otpData}
              showDotLoader={showDotLoader}
              handleOtp={this.handleOtp}
              resendOtp={this.resendOtp}
              resend_url={otp_id}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default SecondaryOtpVerification;
