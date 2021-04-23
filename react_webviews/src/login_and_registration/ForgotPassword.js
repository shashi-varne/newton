import React, { Component } from "react";
import "./Style.scss";
import { getConfig } from "utils/functions";
import { countries } from "./constants";
import Input from "common/ui/Input";
import { initialize } from "./function";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { validateNumber } from "utils/validators";
import Button from "../common/ui/Button";

const config = getConfig();
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: config.productName,
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
    if (name === "mobile" && value && !validateNumber(value)) return;
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  handleClick = () => {
    let { form_data, loginType } = this.state;
    let keys_to_check = ["mobile", "code"];
    if (loginType === "email") keys_to_check = ["email"];
    this.formCheckFields(keys_to_check, form_data, "RESET", loginType);
  };

  render() {
    let { loginType, form_data, isApiRunning, productName } = this.state;
    return (
      <div className="login">
        <div className="header">
          <img src={require(`assets/${config.logo}`)} alt="logo" />
        </div>
        <div className="login-details">
          <div className="left-image">
            <img
              src={require(`assets/${productName}/ils_login.svg`)}
              alt="login"
            />
          </div>
          <div className="login-form">
            <div className="header-text">RESET PASSWORD</div>
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
                    autoFocus
                  />
                </div>
              )}
              {loginType === "email" && (
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
              )}
              <Button
                buttonTitle="RESET PASSWORD"
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
            </div>
            <div className="footer" onClick={() => this.navigate("login")}>
              EXISTING USER? <span>LOGIN</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
