import "./Login.scss";
import React, { Component } from "react";
import { getConfig } from "utils/functions";
import { countries } from "../../constants";
import Input from "common/ui/Input";
import { initialize } from "../../functions";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import { validateNumber } from "utils/validators";
import Button from "../../../common/ui/Button";
import { nativeCallback } from "../../../utils/native_callback";
import Checkbox from "../../../common/ui/Checkbox";
import { navigate } from "../../../utils/functions";

const config = getConfig();
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: config.productName,
      loginType: "mobile",
      form_data: { whatsapp_consent: true, },
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
    this.navigate = navigate.bind(this);
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
    if (name === "mobile" && value && !validateNumber(value)) return;
    if (name === "mobile" && form_data.code === "91" & value.length > 10) return;
    form_data[name] = value;
    if (name === "whatsapp_consent") form_data[name] = !form_data?.whatsapp_consent;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  handleClick = (event) => {
    let { form_data, loginType } = this.state;
    let keys_to_check = ["mobile", "code"];
    if (loginType !== "email")
      this.sendEvents();
    if (loginType === "email") keys_to_check = ["email"];
    this.formCheckFields(keys_to_check, form_data, "LOGIN", loginType);
    event.preventDefault()
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
      loginType,
      form_data,
      isApiRunning,
      productName,
    } = this.state;
    return (
      <div className="login-form" data-aid='login-form'>
        <div className="header-text">LOGIN</div>
        <div className="login-type" data-aid='login-type'>
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
              className="text" data-aid='email'
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
        <div className="form" data-aid='form'>
          {loginType === "mobile" && (
            <div className="form-field">
              <div className="country-code" data-aid='country-code'>
                <div className="dropdown-without-icon">
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
                inputMode="numeric"
                onChange={this.handleChange("mobile")}
                autoFocus
              />
            </div>
          )}

          {loginType === "mobile" && (<div className="declaration-container">
            <Checkbox
              defaultChecked
              checked={form_data?.whatsapp_consent}
              color="default"
              value="checked"
              name="checked"
              handleChange={this.handleChange("whatsapp_consent")}
              index={form_data?.whatsapp_consent}
              className="Checkbox"
            />
            <p>I agree to receive important investment updates on WhatsApp</p>
          </div>)}
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
                  autoFocus
                />
              </div>
            </>
          )}
          <Button
            dataAid='login-btn'
            buttonTitle="LOGIN"
            onClick={this.handleClick}
            showLoader={isApiRunning}
            style={{
              width: "100%",
              letterSpacing: "2px",
              minHeight: "45px",
              borderRadius: `${config?.uiElements?.button?.borderRadius || "2px"
                }`,
            }}
          />
        </div>
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
        <div className="agree-terms" data-aid='agree-terms'>
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
    );
  }
}

export default Login;