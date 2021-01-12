import React, { Component, Fragment } from "react";
import OtpInput from 'react-otp-input';

export default class IwdOtpInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <OtpInput
          numInputs={4}
          containerStyle="iwd-otp-container"
          inputStyle="iwd-otp-input"
          onChange={this.props.onChange}
          hasErrored={!!this.props.errorText}
          value={this.props.value}
          shouldAutoFocus={true}
          onKeyDown={this.props.onKeyDown}
        />
      </Fragment>
    );
  }
}