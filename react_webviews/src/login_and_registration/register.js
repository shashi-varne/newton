import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Select from "@material-ui/core/Select";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";
import Checkbox from "../common/ui/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputUI from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      registerType: "mobile",
      country: {
        name: "India",
        code: "91",
      },
      form_data: {},
      referralCheck: false,
    };
  }

  componentWillMount() {}

  setLoginType = (registerType) => {
    this.setState({
      registerType: registerType,
    });
  };

  handleChange = (name) => {};

  handleCheckbox = () => {
    this.setState({
      referralCheck: !this.state.referralCheck,
    });
  };

  verifyCode = () => {};

  render() {
    let { registerType, country, form_data, referralCheck } = this.state;
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
                onClick={() => this.setLoginType("mobile")}
              >
                MOBILE
                {registerType === "mobile" && <div className="underline"></div>}
              </div>
              <div
                className="text"
                style={{
                  fontWeight: registerType === "email" ? "bold" : "normal",
                }}
                onClick={() => this.setLoginType("email")}
              >
                EMAIL
                {registerType === "email" && <div className="underline"></div>}
              </div>
            </div>
            <div className="form">
              {registerType === "mobile" && (
                <div className="form-field">
                  <Select value={country.code}>
                    {countries.map((data, index) => {
                      return (
                        <option key={index} value={data.code}>
                          {data.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Input
                    // error='This is required.'
                    type="number"
                    value={form_data.mobile}
                    // helperText='This is required.'
                    // placeholder='Enter mobile number'
                    class="input"
                    id="mobile"
                    label="Enter mobile number"
                    name="mobile"
                    onChange={() => this.handleChange("mobile")}
                  />
                </div>
              )}
              {registerType === "email" && (
                <>
                  <div className="form-field">
                    <Input
                      // error='This is required.'
                      type="text"
                      value={form_data.mobile}
                      // helperText='This is required.'
                      // placeholder='Enter mobile number'
                      class="input"
                      id="email"
                      label="Enter email address"
                      name="email"
                      onChange={() => this.handleChange("email")}
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      // error='This is required.'
                      type="text"
                      value={form_data.mobile}
                      // helperText='This is required.'
                      // placeholder='Enter mobile number'
                      class="input"
                      id="password"
                      label="Password"
                      name="email"
                      onChange={() => this.handleChange("password")}
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      // error='This is required.'
                      type="text"
                      value={form_data.mobile}
                      // helperText='This is required.'
                      // placeholder='Enter mobile number'
                      class="input"
                      id="Re-type Password"
                      label="Re-type Password"
                      name="confirmPassword"
                      onChange={() => this.handleChange("confirmPassword")}
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
                      id="input-with-adornment"
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
                <div className="">I have a referral/promo/partner code</div>
              </div>
              <Button>REGISTER</Button>
              <div className="social-block">
                <a className="socialSignupBtns facebookBtn">FACEBOOK</a>
                <a className="socialSignupBtns googleBtn">GOOGLE</a>
              </div>
            </div>
            <div class="footer text-center">
              <span href="#!/login">
                EXISTING USER? <span>LOGIN</span>
              </span>
            </div>
            <div class="agree-terms">
              By signing in, you agree to fisdom's{" "}
              <a href="https://www.fisdom.com/terms/" target="_blank">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="https://www.fisdom.com/privacy/" target="_blank">
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
