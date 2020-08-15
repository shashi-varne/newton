import React, { Component, Fragment } from "react";
import WrButton from "../common/Button";
import WrOtpInput from "../common/OtpInput";
import WrPhoneInput from "../common/PhoneInput";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      otp_error: "Invalid OTP. Please try again",
      phone: "91",
      format: "99999-99999",
      number: "",
    };
  }

  handleOtp = (val) => {
    console.log(val);
    this.setState({ otp: val });
  };

  renderOTPView() {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-mobile-verification.svg")} id="wr-logo" alt="" />
        <div id="wr-title">One Time Password (OTP)</div>
        <div className="subtitle">
          Enter the OTP which has been sent on your mobile phone
        </div>
        <div>
          <WrOtpInput
            onChange={this.handleOtp}
            value={this.state.otp}
            errorText={this.state.otp_error}
          />
        </div>
        <div id="wr-otp-opts">
          <span>Resend OTP</span>
          <span>Enter number again?</span>
        </div>
      </div>
    );
  }

  handleChange = (event) => {
    this.setState({
      code: event.target.value,
    });
  };

  handleCodeChange = (event) => {
    let value = event.target.value.split("/");
    let code = value[0];
    let format =
      code.length <= 2
        ? value[1].slice(code.length + 1) + "99"
        : "9999 9999 9999";

    this.setState({
      phone: event.target.value,
      format: format.split(".").join("9"),
    });
  };

  onChange = (event) => {
    this.setState({
      number: event.target.value,
    });
  };

  renderNumberView() {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="wr-logo" alt="" />
        <div id="wr-title">Login with Phone Number</div>
        <div className="subtitle">
          Please enter your 10 digit mobile number to access your wealth report
        </div>
        <div id="wr-input">Enter phone number</div>
        <WrPhoneInput 
          onCodeChange={this.handleCodeChange}
          onInputChange={this.onChange}
          phone={this.state.phone}
          format={this.state.format}
          number={this.state.number}
        />
      </div>
    );
  }

  renderContinueView = () => (
    <div id="wr-continue">
      <img src="" alt="fisdom" />
      <div id="wr-title">Wealth Report</div>
      <div id="wr-subtitle">
        Now investing money made more easy and safe. We at fisdom monitor your
        money closely at all times to ensure it is always making the most for
        you.
      </div>
    </div>
  );

  render() {
    // const { isPhone, isOtp, isEmail } = this.props.location.params || {};
    const isOtp = true,
      isPhone = false; // TODO: Remove hardcoding

    return (
      <Fragment>
        <div id="wr-login">
          <img
            src={require("assets/ic-login-abstract.svg")}
            alt="banner"
            id="wr-login-img"
          />
          <div id="wr-login-right-panel">
            <img src="" alt="fisdom" /> {/* fisdom logo */}
            <h2>Welcome to Fisdom!</h2>
            {/* { isPhone ? this.renderNumberView() : '' } */}
            {/* { isOtp ? this.renderOTPView() : '' } */}
            {/* {this.renderOTPView()} */}
            {this.renderNumberView()}
            <WrButton fullWidth={true} classes={{ root: "wr-login-btn" }}>
              Continue
            </WrButton>
          </div>
        </div>

        <div id="wr-login-mobile">
          <div id="wr-mobile-view">
            {/* {this.renderContinueView()} */}
            {/* {this.renderOTPView()} */}
            {this.renderNumberView()}
            <div className="wr-continue-btn">
              <WrButton fullWidth={true} classes={{ root: "wr-login-btn" }}>
                Continue
              </WrButton>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
