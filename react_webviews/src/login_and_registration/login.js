import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";
import { initialize } from "./function";
import DropdownWithoutIcon from "../common/ui/SelectWithoutIcon";
import DotDotLoader from "../common/ui/DotDotLoader";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      loginType: "mobile",
      form_data: {},
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
    let { form_data } = this.state;
    form_data.code = "91";
    this.setState({ form_data: form_data });
  }

  setLoginType = (loginType) => {
    this.setState({
      loginType: loginType,
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
    let { form_data, loginType } = this.state;
    let keys_to_check = ["mobile", "code"];
    if (loginType === "email") keys_to_check = ["email", "password"];
    this.formCheckFields(keys_to_check, form_data, loginType);
  };

  render() {
    let { loginType, form_data, isApiRunning } = this.state;
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
              src={require(`assets/${this.state.productName}/ils_login.svg`)}
              alt="login"
            />
          </div>
          <div className="login-form">
            <div className="header-text">LOGIN</div>
            <div className="login-type">
              <div
                className="text"
                style={{
                  fontWeight: loginType === "mobile" ? "bold" : "normal",
                }}
                onClick={() => this.setLoginType("mobile")}
              >
                MOBILE
                {loginType === "mobile" && <div className="underline"></div>}
              </div>
              <div
                className="text"
                style={{
                  fontWeight: loginType === "email" ? "bold" : "normal",
                }}
                onClick={() => this.setLoginType("email")}
              >
                EMAIL
                {loginType === "email" && <div className="underline"></div>}
              </div>
            </div>
            <div className="form">
              {loginType === "mobile" && (
                <div className="form-field">
                  <div className="country-code">
                    <DropdownWithoutIcon
                      onChange={this.handleChange("code")}
                      error={!!form_data.code_error ? true : false}
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
              {loginType === "email" && (
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
                  <div className="forgot_password" href="#!/forgotpassword">
                    FORGOT PASSWORD?
                  </div>
                </>
              )}
              <Button
                disabled={isApiRunning}
                onClick={() => this.handleClick()}
              >
                {isApiRunning && <DotDotLoader />} LOGIN
              </Button>
              <div className="social-block">
                <a className="socialSignupBtns facebookBtn">FACEBOOK</a>
                <a className="socialSignupBtns googleBtn">GOOGLE</a>
              </div>
            </div>
            <div className="footer" onClick={() => this.navigate("register")}>
              <span href="#!/register">
                NEW USER? <span>REGISTER</span>
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

export default Login;
