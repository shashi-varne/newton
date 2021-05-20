import React, { Component } from "react";
import "./Style.scss";
import Input from "common/ui/Input";
import { initialize } from "./function";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
import { validateNumber } from "../utils/validators";
import Button from "../common/ui/Button";

const config = getConfig();
const isMobileView = config.isMobileDevice;
const productName = config.productName;
class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    let { state } = this.props.location || {};
    if (!state || !state.mobile_number) {
      toast("Mobile number not provided");
      this.props.history.goBack();
      return;
    }
    let mobile_number = state.mobile_number;
    let rebalancing_redirect_url = state.rebalancing_redirect_url || false;
    let forgot = state.forgot;
    this.setState({
      mobile_number: mobile_number,
      rebalancing_redirect_url: rebalancing_redirect_url,
      forgot: forgot,
    });
    this.initialize();
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (value && (!validateNumber(value) || value.length > 4)) return;
    let { otp, otp_error } = this.state;
    otp = value;
    otp_error = "";
    this.setState({ otp: otp, otp_error: otp_error });
  };

  handleClick = () => {
    if (this.state.forgot) {
      this.verifyForgotOtp({
        otp: this.state.otp,
      });
    } else {
      this.otpVerification({
        mobile_number: this.state.mobile_number,
        otp: this.state.otp,
      });
    }
  };

  render() {
    let { isApiRunning, otp, otp_error } = this.state;
    let disabled = otp.length !== 4;
    return (
      <div className="login otp">
        {!isMobileView && (
          <div className="header">
            <img src={require(`assets/${config.logo}`)} alt="logo" />
          </div>
        )}
        <div className={`${!isMobileView && "content"} otp-content`}>
          <div className={`${isMobileView && "otp-model-mini"} otp-model`}>
            {productName === "finity" && (
              <div class="logo">
                <img src={require(`assets/finity_navlogo.png`)} alt="finity" />
                <h5>Direct Mutual Funds | NPS</h5>
              </div>
            )}
            {isMobileView && productName !== "finity" && (
              <div class="logo">
                <img src={require(`assets/logo_highres_f.png`)} alt="fisdom" />
                <h5>Join 1000’s of Smart Investors</h5>
              </div>
            )}
            <div className="otp-text">Enter OTP</div>
            <Input
              error={otp_error ? true : false}
              type="text"
              value={otp}
              helperText={otp_error || ""}
              class="input"
              onChange={this.handleChange("otp")}
              inputMode="numeric"
              autoFocus
            />
            <div className="resend-otp" onClick={() => this.resendOtp()}>
              Resend OTP
            </div>
            <Button
              buttonTitle="VERIFY"
              onClick={this.handleClick}
              showLoader={isApiRunning}
              disable={disabled}
              style={{
                maxWidth: "180px",
                minWidth: "180px",
                letterSpacing: "2px",
                minHeight: "45px",
                borderRadius: `${
                  config?.uiElements?.button?.borderRadius || "2px"
                }`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Otp;
