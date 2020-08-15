import React, { Component } from "react";
import WrButton from "../common/Button";
import WrOtpInput from "../common/OtpInput";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import CountryData from "country-telephone-data";
import InputMask from "react-input-mask";
import Select from "@material-ui/core/Select";

class LoginMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "91",
      format: "99999-99999",
      number: "",
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
            countryCodeEditable={false}
          />
        </div>
        <div id="wr-otp-opts">
          <span>Enter number again?</span>
        </div>
      </div>
    );
  }

  handleChange = (event) => {
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
        <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} alt="" />
        <div id="wr-title">Login with Phone Number</div>
        <div className="subtitle">
          Enter yout phone number to access your wealth report
        </div>
        <div id="wr-input">Enter phone number</div>

        <FormControl className="wr-code-input">
          <Select
            value={phone}
            renderValue={(phone) => `+${phone.split("/")[0]}`}
            onChange={this.handleChange}
            disableUnderline={true}
            inputProps={{
              name: "phone",
            }}
            classes={{root: "wr-select-input", selectMenu:"wr-menu"}}
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
