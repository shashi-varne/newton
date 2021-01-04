import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Select from "@material-ui/core/Select";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      loginType: "mobile",
      country: {
        name: "India",
        code: "91",
      },
      form_data: {},
    };
  }

  componentWillMount() {}

  setLoginType = (loginType) => {
    this.setState({
      loginType: loginType,
    });
  };

  handleChange = (name) => {};

  render() {
    let { loginType, country, form_data } = this.state;
    return (
      <div className="login">
        <div className="header">
          <img
            src={require(`assets/${this.state.productName}_white_logo.png`)}
            alt="logo"
          />
        </div>
        <div className="login-details">
          <div
            className="left-image"
            style={{
              display: getConfig().isMobileDevice && "none",
            }}
          >
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
              {loginType === "email" && (
                <>
                  <div className="form-field">
                    <Input
                      // error='This is required.'
                      type="number"
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
                      type="number"
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
                  <div className="forgot_password" href="#!/forgotpassword">
                    FORGOT PASSWORD?
                  </div>
                </>
              )}
              <Button>LOGIN</Button>
              <div className="social-block">
                <a className="socialSignupBtns facebookBtn">FACEBOOK</a>
                <a className="socialSignupBtns googleBtn">GOOGLE</a>
              </div>
            </div>
            <div class="footer text-center">
              <span href="#!/register">
                NEW USER? <span>REGISTER</span>
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

export default Login;
