import React, { Component } from "react";
import "./Style.scss";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";
import { initialize } from "./function";
import { getConfig } from "utils/functions";
import toast from "../common/ui/Toast";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    this.setState({ mobile_number: mobile_number });
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
    this.otpVerification({
      mobile_number: this.state.mobile_number,
      otp: this.state.otp,
    });
  };

  render() {
    let { isApiRunning, otp, otp_error } = this.state;
    let disabled = isApiRunning || otp.length !== 4;
    return (
      <div className="login otp">
        <div className="header">
          <img
            src={require(`assets/${this.state.productName}_white_logo.png`)}
            alt="logo"
          />
        </div>
        <div className="otp-content">
          <div className="otp-model">
            <div>Enter OTP</div>
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
