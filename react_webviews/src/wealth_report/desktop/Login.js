import React, { Component, Fragment } from 'react';
import WrButton from '../common/Button';
import WrOtpInput from '../common/OtpInput';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CountryData from "country-telephone-data";
import InputMask from "react-input-mask";
import Select from "@material-ui/core/Select";
import LoginMobile from './LoginMobile';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      otp_error: 'Invalid OTP. Please try again',
      phone: "91",
      format: "99999-99999",
      number: "",
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
    const result = CountryData.allCountries.filter(
      (code, index) => code.format !== undefined
    );
    let { phone } = this.state;
    return (
      <div className="wr-login-input">
        <div className="subtitle">
          Please enter your 10 digit mobile number to access your wealth report
        </div>
        <div className="wr-input-form">
          <FormControl className="wr-code-input">
            <Select
              value={phone}
              renderValue={(phone) => `+${phone.split("/")[0]}`}
              onChange={this.handleCodeChange}
              disableUnderline={true}
              inputProps={{
                name: "phone",
              }}
              classes={{root: "wr-select-input"}}
              disableFocusRipple={true}
            >
              {result.map((code, index) => (
                <MenuItem key={index} value={code.dialCode + "/" + code.format}>
                  {`${code.name} +${code.dialCode}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className="wr-mob-input" style={{width:'70%'}}>
            <InputMask
              mask={this.state.format}
              maskChar=""
              value={this.state.number}
              onChange={this.onChange}
            >
              {() => (
                <TextField
                  margin="normal"
                  type="text"
                  value={this.state.number}
                  placeholder={this.state.format}
                  InputProps={{
                    disableUnderline:true,
                    root:'wr-mob-input'
                  }}
                />
              )}
            </InputMask>
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
            {/* { isOtp ? this.renderOTPView() : '' } */}
            {this.renderNumberView()}
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