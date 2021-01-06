import React, { Component } from "react";
import "./Style.scss";
import Input from "../common/ui/Input";
import Button from "@material-ui/core/Button";
import { initialize } from "./function";
import DotDotLoader from "../common/ui/DotDotLoader";
import { getConfig } from "utils/functions";

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      otp: '',
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
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

  handleClick = () => {};

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
            <div className="resend-otp">Resend OTP</div>
            <Button
              className={disabled ? "disabled" : "button"}
              disabled={disabled}
            >
              VERIFY {isApiRunning && <DotDotLoader />}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Otp;
