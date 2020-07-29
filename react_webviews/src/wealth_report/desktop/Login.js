import React, { Component } from 'react';
import WrButton from '../common/Button';
import WrOtpInput from '../common/OtpInput';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      otp_error: 'Invalid OTP. Please try again',
    };
  }

  handleOtp = (val) => {
    console.log(val);
    this.setState({ otp: val });
  }

  renderOTPView() {
    return (
      <div className="wr-login-input">
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

  renderNumberView() {
    return (
      <div className="wr-login-input">
        <div className="subtitle">
          Please enter your 10 digit mobile number to access your wealth report
        </div>
        <div>
        </div>
      </div>
    );
  }
  render() {
    // const { isPhone, isOtp, isEmail } = this.props.location.params || {};
    const isOtp = true, isPhone = false; // TODO: Remove hardcoding
    return(
      <div id="wr-login">
        <img
          src={require('assets/ic-login-abstract.svg')}
          alt="banner"
          id="wr-login-img"  
          />
        <div id="wr-login-right-panel">
          <img src="" alt="fisdom"/> {/* fisdom logo */}
          <h2>Welcome to Fisdom!</h2>
          { isPhone ? this.renderNumberView() : '' }
          { isOtp ? this.renderOTPView() : '' }
          {/* { isEmail ? this.renderNumberView() : '' } */}
          <WrButton fullWidth={true} classes={{ root: 'wr-login-btn' }}>Continue</WrButton>
        </div>
      </div>
    );
  }
}