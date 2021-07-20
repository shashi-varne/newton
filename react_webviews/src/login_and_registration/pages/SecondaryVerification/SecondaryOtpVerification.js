import React, { Component } from "react";
import Container from "../../../dashboard/common/Container";
import OtpContainer from "../../common/OtpContainer";
import { initialize } from "../../functions";
import "./secondaryVerification.scss";
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

  secondaryOtpNavigate = () => this.navigate('/secondary-verification', {
    state: {
      communicationType: this.state.communicationType,
      contactValue: this.state.value,
      edit: true,
    }
  })

  render() {
    const { showDotLoader, communicationType, otp_id, value, isWrongOtp } = this.state;
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
        <OtpContainer
          handleClickText={"EDIT"}
          handleClick={this.secondaryOtpNavigate}
          loginType={communicationType}
          classes={{
            body: "verify-otp-container-secondary"
          }}
          otpData={this.state.otpData}
          showDotLoader={showDotLoader}
          handleOtp={this.handleOtp}
          resendOtp={this.resendOtp}
          isWrongOtp={isWrongOtp}
          resend_url={otp_id}
          value={value}   >
        </OtpContainer>
      </Container>
    );
  }
}

export default SecondaryOtpVerification;
