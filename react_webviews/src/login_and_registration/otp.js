import React, { Component } from "react";
import "./Style.scss";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";
import { initialize } from "./function";
import { getConfig } from "utils/functions";
import toast from "../common/ui/Toast";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const isMobileView = getConfig().isMobileDevice;

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
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
    let forgot =  state.forgot;
    this.setState({
      mobile_number: mobile_number,
      rebalancing_redirect_url: rebalancing_redirect_url,
      forgot: forgot,
    });
    this.initialize();
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    if (value.length > 4) return;
    let { otp, otp_error } = this.state;
    otp = value;
    otp_error = "";
    this.setState({ otp: otp, otp_error: otp_error });
  };

  handleClick = () => {
    if(this.state.forgot) {
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
    let disabled = isApiRunning || otp.length !== 4;
    return (
      <div className="login otp">
        <ToastContainer autoClose={3000} />
        {!isMobileView && (
          <div className="header">
            <img
              src={require(`assets/${this.state.productName}_white_logo.png`)}
              alt="logo"
            />
          </div>
        )}
        <div className={`${!isMobileView && "content"} otp-content`}>
          <div className={`${isMobileView && "otp-model-mini"} otp-model`}>
            {this.state.productName === "finity" && (
              <div class="logo">
                <img src={require(`assets/finity_navlogo.png`)} alt="finity" />
                <h5>Direct Mutual Funds | NPS</h5>
              </div>
            )}
            {isMobileView && this.state.productName !== "finity" && (
              <div class="logo">
                <img src={require(`assets/logo_highres_f.png`)} alt="fisdom" />
                <h5>Join 1000’s of Smart Investors</h5>
              </div>
            )}
            <div className="otp-text">Enter OTP</div>
            <Input
              error={otp_error ? true : false}
              type="number"
              value={otp}
              helperText={otp_error || ""}
              class="input"
              onChange={this.handleChange("otp")}
            />
            <div className="resend-otp" onClick={() => this.resendOtp()}>
              Resend OTP
            </div>
            <Button
              className={disabled ? "disabled" : "button"}
              disabled={disabled}
              onClick={() => this.handleClick()}
            >
              VERIFY{" "}
              {isApiRunning && (
                <div className="loader">
                  <CircularProgress size={20} thickness={3} />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Otp;
