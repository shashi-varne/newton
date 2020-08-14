import React, { Component, Fragment } from 'react';
import WrButton from '../common/Button';
import WrOtpInput from '../common/OtpInput';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import LoginMobile from './LoginMobile';
import MuiPhoneNumber from 'material-ui-phone-number';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      otp_error: 'Invalid OTP. Please try again',
      code: +91
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

  handleChange = (event) => {
    this.setState({
      code: event.target.value
    })
  }

  renderEmailView() {
    return (
      <div className="wr-login-input">
        <div className="subtitle">
          Please enter your email address and password
        </div>
        <div>
        <FormControl className="wr-form">
          <TextField
            id="outlined-basic"
            variant="outlined"
            classes={{ root: "wr-root" }}
            InputProps={{
              disableUnderline: true,
              placeholder:'Enter email address'
            }}
          />
        </FormControl>
        <FormControl className="wr-form">
          <TextField
            id="outlined-basic"
            variant="outlined"
            classes={{ root: "wr-root" }}
            InputProps={{
              disableUnderline: true,
              type:'password',
              placeholder:'Enter password'
            }}
          />
        </FormControl>
        <div id="wr-forgot">Forgot password</div>
        </div>
      </div>

    )
  }

  renderNumberView() {
    return (
      <div className="wr-login-input">
        <div className="subtitle">
          Please enter your 10 digit mobile number to access your wealth report
        </div>
        <div>
        <MuiPhoneNumber defaultCountry={'us'} onChange={this.handleOnChange} />
        </div>
      </div>
    );
  }

  renderNum = () => {
    return (
      <div className="wr-login-input">
        <div className="subtitle">
          Please enter your 10 digit mobile number to access your wealth report
        </div>
        <div>
        <FormControl className=''>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={this.state.code}
          onChange={this.handleChange}
          disableUnderline={true}
        >
          {/* {codes.map(code => (
            <MenuItem>{`+${code}`}</MenuItem>
          ))} */}
        </Select>
      </FormControl>
        </div>
      </div>
    );
  }

  render() {
    // const { isPhone, isOtp, isEmail } = this.props.location.params || {};
    const isOtp = true, isPhone = false; // TODO: Remove hardcoding

    return(
      <Fragment>
        <div id="wr-login">
          <img
            src={require('assets/ic-login-abstract.svg')}
            alt="banner"
            id="wr-login-img"  
          />
          <div id="wr-login-right-panel">
            <img src="" alt="fisdom"/> {/* fisdom logo */}
            <h2>Welcome to Fisdom!</h2>
            {/* { isPhone ? this.renderNumberView() : '' } */}
            { isOtp ? this.renderOTPView() : '' }
            {/* { isEmail ? this.renderNumberView() : '' } */}
          <WrButton fullWidth={true} classes={{ root: 'wr-login-btn' }}>Continue</WrButton>
        </div>
      </div>

      <div id="wr-login-mobile">
        <LoginMobile 
          handleOtp={this.handleOtp}
          otp={this.state.otp}
          otp_error={this.state.otp_error}
        />
      </div>

      </Fragment>
    );
  }
}