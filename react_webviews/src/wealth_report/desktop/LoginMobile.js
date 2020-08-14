import React, { Component } from "react";
import WrButton from "../common/Button";
import WrOtpInput from "../common/OtpInput";
// import MuiPhoneNumber from "material-ui-phone-number";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/material.css';

class LoginMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone:''
    };
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

  renderOTPView() {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-mobile-verification.svg")} alt="" />
        <div id="wr-title">One Time Password (OTP)</div>
        <div className="subtitle">
          Enter the 5 digit OTP to verify your phone number
        </div>
        <div id="wr-otp">
          <div style={{ color: "#a9aebe" }}>Enter OTP</div>
          <div style={{ color: "var(--primary)" }}>Resend OTP</div>
        </div>
        <div>
          <WrOtpInput
            onChange={this.props.handleOtp}
            value={this.props.otp}
            errorText={this.props.otp_error}
          />
        </div>
        <div id="wr-otp-opts">
          <span>Enter number again?</span>
        </div>
      </div>
    );
  }

  handleOnChange() {}

  renderNumberView() {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} alt="" />
        <div id="wr-title">Login with Phone Number</div>
        <div className="subtitle">
          Enter yout phone number to access your wealth report
        </div>
        <div id="wr-input">Enter phone number</div>
        <div>
          {/* <MuiPhoneNumber
            defaultCountry={"in"}
            onChange={this.handleOnChange}
          /> */}
          
          <div style={{marginTop:'10px'}}>
          <PhoneInput
            country={'us'}
            value={this.state.phone}
            onChange={phone => this.setState({ phone })}
          />
          </div>
        </div>
      </div>
    );
  }

  renderEmailView() {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} alt="" />
        <div id="wr-title">Login with Email</div>
        {/* this line has to be changed */}
        <div className="subtitle">Enter Email and Password to continue</div>
        <div id="wr-input">Enter email address</div>
        <FormControl className="wr-form">
          <TextField
            id="outlined-basic"
            variant="outlined"
            classes={{ root: "wr-root" }}
            InputProps={{
              disableUnderline: true,
              placeholder: "uttam@fisdom.com",
            }}
          />
        </FormControl>
        <div id="wr-input">Enter password</div>
        <FormControl className="wr-form">
          <TextField
            id="outlined-basic"
            variant="outlined"
            classes={{ root: "wr-root" }}
            InputProps={{
              disableUnderline: true,
              type: "password",
              placeholder: "............",
            }}
          />
        </FormControl>
      </div>
    );
  }

  render() {
    return (
      <div
        style={{
          width: "90%",
          margin: "auto",
        }}
      >
        {/* {this.renderContinueView()} */}
        {/* {this.renderOTPView()} */}
        {/* {this.renderEmailView()} */}
        {this.renderNumberView()}
        <div className="wr-continue-btn">
          <WrButton fullWidth={true} classes={{ root: "wr-login-btn" }}>
            Continue
          </WrButton>
        </div>
      </div>
    );
  }
}

export default LoginMobile;
