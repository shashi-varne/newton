import React, { Component } from "react";
import OtpInput from "react-otp-input";
import DotDotLoader from "../../../common/ui/DotDotLoader";

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdownInterval: null,
      timeAvailable: this.props.otpData.timeAvailable,
      totalTime: this.props.otpData.totalTime,
      error: this.props.isError,
      showDotLoader: this.props.showDotLoader,
    };

    this.resendOtp = this.resendOtp.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  componentDidMount() {
    let intervalId = setInterval(this.countdown, 1000);
    this.setState({
      countdownInterval: intervalId,
    });
  }

  resendOtp = async () => {
    await this.props.resendOtp(this.props.resend_url);
    let intervalId = setInterval(this.countdown, 1000);

    this.setState({
      timeAvailable: this.state.totalTime,
      countdownInterval: intervalId,
    });
  };

  countdown = () => {
    if (!this.props.isError) {
      let timeAvailable = this.state.timeAvailable;
      timeAvailable--;
      if (timeAvailable <= 0) {
        timeAvailable = 0;
        clearInterval(this.state.countdownInterval);
      }

      this.setState({
        timeAvailable: timeAvailable,
      });
    } else {
      clearInterval(this.state.countdownInterval);
      this.setState({
        timeAvailable: 0,
      });
    }
  };

  render() {
    const { timeAvailable } = this.state;
    return (
      <div className="communication-details-otp-container">
        <div>
          <OtpInput
            numInputs={4}
            id="default-otp"
            containerStyle="default-otp-input-container"
            inputStyle="default-otp-input"
            onChange={this.props.handleOtp}
            hasErrored={true}
            placeholder="X"
            value={this.props.otpData.otp}
            isDisabled={this.props.isDisabled || false}
            errorStyle={this.props.isWrongOtp ? "otp-error-style" : ""}
          />
        </div>
        {this.props.isWrongOtp  && <p className="invalid-otp">Invalid OTP</p>}
        {timeAvailable > 0 && !this.props.showDotLoader && (
          <div className="cd-otp-time-text">
            OTP should arrive within{" "}
            {timeAvailable < 10 ? `0${timeAvailable}` : timeAvailable}s
          </div>
        )}
        {(timeAvailable <= 0 || !timeAvailable) && (
          <div
            className={`cd-otp-resend-text ${this.props.class}`}
            onClick={this.resendOtp}
          >
            {this.props.showDotLoader ? (
              <DotDotLoader className="cd-resend-loader" />
            ) : (
              "RESEND OTP"
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Otp;
