import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Input from "common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputUI from "material-ui/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { initialize } from "./function";
import CircularProgress from "@material-ui/core/CircularProgress";
import { validateNumber } from "utils/validators";
import Button from "../common/ui/Button";
import { nativeCallback } from "../utils/native_callback";
import { Imgc } from "../common/ui/Imgc";

const config = getConfig();
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: config.productName,
      registerType: "mobile",
      form_data: {},
      referralCheck: false,
      isApiRunning: false,
      isPromoApiRunning: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
    let { form_data } = this.state;
    form_data.code = "91";
    this.setState({ form_data: form_data });
  }

  setRegistrationType = (registerType) => {
    this.setState({
      registerType: registerType,
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (name === "mobile" && value && !validateNumber(value)) return;
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  handleClick = (event) => {
    let { form_data, registerType } = this.state;
    let keys_to_check = ["mobile", "code"];
    if(registerType !== "email")
      this.sendEvents()
    if (registerType === "email")
      keys_to_check = ["email", "password", "confirm_password"];
    this.formCheckFields(keys_to_check, form_data, "REGISTER", registerType);
    event.preventDefault();
  };

  handleCheckbox = () => {
    this.setState({
      referralCheck: !this.state.referralCheck,
    });
  };

  sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'otp sent to user',
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let {
      registerType,
      form_data,
      referralCheck,
      isApiRunning,
      isPromoApiRunning,
      facebookUrl,
      googleUrl,
    } = this.state;
    return (
      <div className="login" data-aid='login-register'>
        <div className="header">
          <img src={require(`assets/${config.logo}`)} alt="logo" />
        </div>
        <div className="login-details" data-aid='login-details'>
          <div className="left-image">
            <Imgc
              src={require(`assets/${this.state.productName}/ils_register.svg`)}
              alt="register"
              className="login-left-icon"
            />
          </div>
          <div className="login-form" data-aid='login-form'>
            <div className="header-text" data-aid='register-text'>REGISTER</div>
            <div className="login-type" data-aid='login-type'>
              <div
                className="text"
                style={{
                  fontWeight: registerType === "mobile" ? "500" : "normal",
                }}
                onClick={() => this.setRegistrationType("mobile")}
                data-aid='mobile-text'
              >
                MOBILE
                {registerType === "mobile" && <div className="underline"></div>}
              </div>
              <div
                className="text"
                style={{
                  fontWeight: registerType === "email" ? "500" : "normal",
                }}
                onClick={() => this.setRegistrationType("email")}
                data-aid='email-text'
              >
                EMAIL
                {registerType === "email" && <div className="underline"></div>}
              </div>
            </div>
            <form className="form" data-aid='form' onSubmit={this.handleClick}>
              {registerType === "mobile" && (
                <div className="form-field">
                  <div className="country-code" data-aid='country-code'>
                    <DropdownWithoutIcon
                      onChange={this.handleChange("code")}
                      error={form_data.code_error ? true : false}
                      helperText={form_data.code_error || ""}
                      options={countries}
                      value={form_data.code || "91"}
                      width={20}
                      id="code"
                      name="code"
                      isAOB={true}
                    />
                  </div>
                  <Input
                    error={form_data.mobile_error ? true : false}
                    type="text"
                    value={form_data.mobile || ""}
                    helperText={form_data.mobile_error || ""}
                    class="input mobile-number"
                    id="mobile"
                    label="Enter mobile number"
                    name="mobile"
                    onChange={this.handleChange("mobile")}
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
              )}
              {registerType === "email" && (
                <>
                  <div className="form-field">
                    <Input
                      error={form_data.email_error ? true : false}
                      type="text"
                      value={form_data.email}
                      helperText={form_data.email_error || ""}
                      class="input"
                      id="email"
                      label="Enter email address"
                      name="email"
                      onChange={this.handleChange("email")}
                      autoFocus
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      error={form_data.password_error ? true : false}
                      type="password"
                      value={form_data.password}
                      helperText={form_data.password_error || ""}
                      class="input"
                      id="password"
                      label="Password"
                      name="email"
                      onChange={this.handleChange("password")}
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      error={form_data.confirm_password_error ? true : false}
                      type="password"
                      value={form_data.confirm_password}
                      helperText={form_data.confirm_password_error || ""}
                      class="input"
                      id="Re-type Password"
                      label="Re-type Password"
                      name="confirm_password"
                      onChange={this.handleChange("confirm_password")}
                    />
                  </div>
                </>
              )}
              {referralCheck && (
                <div className="form-field referral-code-input" data-aid='referral-code-input'>
                  <FormControl className="referral-form" id="referral-form" data-aid='referral-form'>
                    <InputLabel>Enter referral/partner code</InputLabel>
                    <InputUI
                      className="input"
                      id="referral_code"
                      error={form_data.referral_code_error ? true : false}
                      onChange={this.handleChange("referral_code")}
                      value={form_data.referral_code || ""}
                      endAdornment={
                        <InputAdornment position="end">
                          <div
                            className="verify-button"
                            onClick={() => this.verifyCode(form_data)}
                            data-aid='verify-btn'
                          >
                            {isPromoApiRunning ? (
                              <div className="loader">
                                <CircularProgress size={15} thickness={3} />
                              </div>
                            ) : (
                              "VERIFY"
                            )}
                          </div>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {form_data.referral_code_error && (
                    <div className="helper-text" data-aid='helper-text'>
                      {form_data.referral_code_error}
                    </div>
                  )}
                </div>
              )}
              <div className="referral-code" data-aid='referral-code-checkbox'>
                <Checkbox
                  checked={referralCheck}
                  color="default"
                  value="checked"
                  name="checked"
                  handleChange={this.handleCheckbox}
                  class="checkbox"
                />
                <div data-aid='referral-code-checkbox-text'>I have a referral/promo/partner code</div>
              </div>
              <Button
                dataAid='register-btn'
                buttonTitle="REGISTER"
                onClick={this.handleClick}
                showLoader={isApiRunning}
                buttonType="submit"
                style={{
                  width: "100%",
                  letterSpacing: "2px",
                  minHeight: "45px",
                  borderRadius: `${
                    config?.uiElements?.button?.borderRadius || "2px"
                  }`,
                }}
              />
              {this.state.resendVerification && (
                <div
                  className="resend-verification"
                  onClick={() => this.resendVerificationLink()}
                  data-aid='resend-verification'
                >
                  <span>Resend verification link </span>
                  <span className="loader">
                    {this.state.resendVerificationApi && (
                      <CircularProgress size={15} thickness={5} />
                    )}
                  </span>
                </div>
              )}
              <div className="social-block" data-aid='social-block'>
                <a className="socialSignupBtns facebookBtn" data-aid='social-signupbtns-facebookbtn' href={facebookUrl}>
                  FACEBOOK
                </a>
                <a className="socialSignupBtns googleBtn" data-aid='social-signupbtns-googlebtn' href={googleUrl}>
                  GOOGLE
                </a>
              </div>
            </form>
            <div className="footer"  data-aid='footer' onClick={() => this.navigate("login")}>
              EXISTING USER? <span data-aid='login-btn'>LOGIN</span>
            </div>
            <div className="agree-terms" data-aid='agree-terms'>
              By signing in, you agree to {config.productName}'s{" "}
              <a
                href={config.termsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href={config.privacyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
