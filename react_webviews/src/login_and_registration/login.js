import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Input from "common/ui/Input";
import Button from "material-ui/Button";
import { initialize } from "./function";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import CircularProgress from "@material-ui/core/CircularProgress";
import { validateNumber } from "utils/validators";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

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
    if (name === "mobile" && value && !validateNumber(value)) value = "";
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  handleClick = () => {
    let { form_data, loginType } = this.state;
    let keys_to_check = ["mobile", "code"];
    if (loginType === "email") keys_to_check = ["email", "password"];
    this.formCheckFields(keys_to_check, form_data, "LOGIN", loginType);
  };

  render() {
    let {
      loginType,
      form_data,
      isApiRunning,
      productName,
      facebookUrl,
      googleUrl,
    } = this.state;
    return (
      <div className="login">
        <ToastContainer autoClose={3000} />
        <div className="header">
          <img
            src={require(`assets/${productName}_white_logo.png`)}
            alt="logo"
          />
        </div>
        <div className="login-details">
          <div className="left-image">
            <img
              src={require(`assets/${productName}/ils_login.svg`)}
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
              {productName !== "finity" && (
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
              )}
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
                    type="text"
                    value={form_data.mobile || ""}
                    helperText={form_data.mobile_error || ""}
                    class="input mobile-number"
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
                  <div
                    className="forgot_password"
                    onClick={() => this.navigate("forgot-password")}
                  >
                    FORGOT PASSWORD?
                  </div>
                </>
              )}
              <Button
                className={isApiRunning ? "disabled" : "button"}
                disabled={isApiRunning}
                onClick={() => this.handleClick()}
              >
                LOGIN
                {isApiRunning && (
                  <div className="loader">
                    <CircularProgress size={20} thickness={3} />
                  </div>
                )}
              </Button>
              {productName !== "finity" && (
                <div className="social-block">
                  <a
                    className="socialSignupBtns facebookBtn"
                    href={facebookUrl}
                  >
                    FACEBOOK
                  </a>
                  <a className="socialSignupBtns googleBtn" href={googleUrl}>
                    GOOGLE
                  </a>
                </div>
              )}
            </div>
            {productName !== "finity" && (
              <div className="footer" onClick={() => this.navigate("register")}>
                <span href="#!/register">
                  NEW USER? <span>REGISTER</span>
                </span>
              </div>
            )}
            {productName === "finity" && (
              <div className="features">
                <div className="item">
                  <img src={require(`assets/icons-07.png`)} alt="" />
                  <div className="title">Bank Grade Security</div>
                </div>
                <div className="item">
                  <img src={require(`assets/icons-09.png`)} alt="" />
                  <div className="title">Track & Withdraw 24/7</div>
                </div>
                <div className="item">
                  <img src={require(`assets/portfolio-rebal.png`)} alt="" />
                  <div className="title">Portfolio Rebalancing</div>
                </div>
                <div className="item">
                  <img src={require(`assets/insta_switch.png`)} alt="" />
                  <div className="title">Insta Switch</div>
                </div>
                <div className="item">
                  <img src={require(`assets/smart_reco.png`)} alt="" />
                  <div className="title">Smart Recommendation Engine</div>
                </div>
                <div className="item">
                  <img src={require(`assets/icons-08.png`)} alt="" />
                  <div className="title">Paperless KYC in 5 minutes</div>
                </div>
              </div>
            )}
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
