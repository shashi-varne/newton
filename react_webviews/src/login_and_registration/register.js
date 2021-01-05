import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";
import Checkbox from "../common/ui/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputUI from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import { formCheckFields } from "./function";
import DropdownWithoutIcon from "../common/ui/SelectWithoutIcon";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      registerType: "mobile",
      form_data: {},
      referralCheck: false,
    };
    this.formCheckFields = formCheckFields.bind(this);
  }

  componentWillMount() {
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
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  handleClick = () => {
    let { form_data, registerType, referralCheck } = this.state;
    let keys_to_check = ["mobile", "code"];
    if (registerType === "email") keys_to_check = ["email", "password", 'confirmPassword'];
    if (referralCheck) keys_to_check.push("referral_code");
    this.formCheckFields(keys_to_check, form_data, registerType);
  };

  handleCheckbox = () => {
    this.setState({
      referralCheck: !this.state.referralCheck,
    });
  };

  verifyCode = () => {};

  render() {
    let { registerType, form_data, referralCheck } = this.state;
    return (
      <div className="login">
        <div className="header">
          <img
            src={require(`assets/${this.state.productName}_white_logo.png`)}
            alt="logo"
          />
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
                    type="number"
                    value={form_data.mobile}
                    helperText={form_data.mobile_error || ""}
                    class="input"
                    id="mobile"
                    label="Enter mobile number"
                    name="mobile"
                    onChange={this.handleChange("mobile")}
                  />
                </div>
              )}
              {registerType === "email" && (
                <>
                  <div className="form-field">
                    <Input
                      error={form_data.email_error  ? true : false}
                      type="text"
                      value={form_data.mobile}
                      helperText={form_data.email_error || ""}
                      class="input"
                      id="email"
                      label="Enter email address"
                      name="email"
                      onChange={this.handleChange("email")}
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      error={form_data.password_error  ? true : false}
                      type="text"
                      value={form_data.mobile}
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
                      error={form_data.confirmPassword_error ? true : false}
                      type="text"
                      value={form_data.mobile}
                      helperText={form_data.confirmPassword_error || ""}
                      class="input"
                      id="Re-type Password"
                      label="Re-type Password"
                      name="confirmPassword"
                      onChange={this.handleChange("confirmPassword")}
                    />
                  </div>
                </>
              )}
              {referralCheck && (
                <div className="form-field">
                  <FormControl className="referral-form">
                    <InputLabel>Enter referral/partner code</InputLabel>
                    <InputUI
                      className="input"
                      id="referral_code"
                      error={form_data.referral_code_error  ? true : false}
                      // helperText={form_data.referral_code_error || ""}
                      onChange={this.handleChange("referral_code")}
                      endAdornment={
                        <InputAdornment position="end">
                          <div
                            className="verify-button"
                            onClick={this.verifyCode}
                          >
                            VERIFY
                          </div>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
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
              <Button onClick={() => this.handleClick()} >REGISTER</Button>
              <div className="social-block">
                <a className="socialSignupBtns facebookBtn">FACEBOOK</a>
                <a className="socialSignupBtns googleBtn">GOOGLE</a>
              </div>
            </div>
            <div className="footer text-center">
              <span href="#!/login">
                EXISTING USER? <span>LOGIN</span>
              </span>
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
