import React, { Component } from "react";
import OtpInput from "react-otp-input";
import DotDotLoader from "../../../common/ui/DotDotLoaderNew";

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdownInterval: null,
      timeAvailable: this.props.state.timeAvailable,
      totalTime: this.props.state.totalTime,
      error: this.props.isError,
      showDotLoader: this.props.showDotLoader,
    };

    this.resendOtp = this.resendOtp.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  componentDidMount() {
    var inputs = document.getElementsByTagName("input");
    for (var index = 0; index < inputs.length; ++index) {
      inputs[index].placeholder = "";
    }
    let intervalId = setInterval(this.countdown, 1000);
    this.setState({
      countdownInterval: intervalId,
    });
  }

  resendOtp = () => {
    let intervalId = setInterval(this.countdown, 1000);

    this.setState({
      timeAvailable: this.state.totalTime,
      countdownInterval: intervalId,
    });
    this.props.resendOtp();
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
            value={this.props.state.otp}
            isDisabled={this.props.isDisabled || false}
          />
        </div>

        {timeAvailable > 0 && (
          <div className="cd-otp-time-text">
            OTP should arrive within{" "}
            {timeAvailable < 10 ? `0${timeAvailable}` : timeAvailable}s
          </div>
        )}
        {(timeAvailable <= 0 || !timeAvailable) && !this.props.isDisabled && (
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
