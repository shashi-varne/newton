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
      form_data: {},
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  handleClick = () => {};

  render() {
    let { form_data, isApiRunning } = this.state;
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
              error={form_data.otp_error ? true : false}
              type="number"
              value={form_data.otp}
              helperText={form_data.otp_error || ""}
              class="input"
              onChange={this.handleChange("otp")}
            />
            <div className="resend-otp">Resend OTP</div>
            <Button>VERIFY {isApiRunning && <DotDotLoader />}</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Otp;
