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

  handleClick = () => {
    let { form_data, registerType } = this.state;
    let keys_to_check = ["mobile", "code"];
    if(registerType !== "email")
      nativeCallback({events: 'otp sent to user'}) // to be confirmed
    if (registerType === "email")
      keys_to_check = ["email", "password", "confirm_password"];
    this.formCheckFields(keys_to_check, form_data, "REGISTER", registerType);
  };

  handleCheckbox = () => {
    this.setState({
      referralCheck: !this.state.referralCheck,
    });
  };

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
      <div className="login">
        <div className="header">
          <img src={require(`assets/${config.logo}`)} alt="logo" />
        </div>
        <div className="login-details">
          <div className="left-image">
            <img
              src={require(`assets/${this.state.productName}/ils_register.svg`)}
              alt="register"
            />
          </div>
          <div className="login-form">
            <div className="header-text">REGISTER</div>
            <div className="login-type">
              <div
                className="text"
                style={{
                  fontWeight: registerType === "mobile" ? "bold" : "normal",
                }}
                onClick={() => this.setRegistrationType("mobile")}
              >
                MOBILE
                {registerType === "mobile" && <div className="underline"></div>}
              </div>
              <div
                className="text"
                style={{
                  fontWeight: registerType === "email" ? "bold" : "normal",
                }}
                onClick={() => this.setRegistrationType("email")}
              >
                EMAIL
                {registerType === "email" && <div className="underline"></div>}
              </div>
            </div>
            <div className="form">
              {registerType === "mobile" && (
                <div className="form-field">
                  <div className="country-code">
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
                <div className="form-field referral-code-input">
                  <FormControl className="referral-form">
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
                    <div className="helper-text">
                      {form_data.referral_code_error}
                    </div>
                  )}
                </div>
              )}
              <div className="referral-code">
                <Checkbox
                  checked={referralCheck}
                  color="default"
                  value="checked"
                  name="checked"
                  handleChange={this.handleCheckbox}
                  class="checkbox"
                />
                <div>I have a referral/promo/partner code</div>
              </div>
              <Button
                buttonTitle="REGISTER"
                onClick={this.handleClick}
                showLoader={isApiRunning}
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
                >
                  <span>Resend verification link </span>
                  <span className="loader">
                    {this.state.resendVerificationApi && (
                      <CircularProgress size={15} thickness={5} />
                    )}
                  </span>
                </div>
              )}
              <div className="social-block">
                <a className="socialSignupBtns facebookBtn" href={facebookUrl}>
                  FACEBOOK
                </a>
                <a className="socialSignupBtns googleBtn" href={googleUrl}>
                  GOOGLE
                </a>
              </div>
            </div>
            <div className="footer" onClick={() => this.navigate("login")}>
              EXISTING USER? <span>LOGIN</span>
            </div>
            <div className="agree-terms">
              By signing in, you agree to fisdom's{" "}
              <a
                href="https://www.fisdom.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="https://www.fisdom.com/privacy/"
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
