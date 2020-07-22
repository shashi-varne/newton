import React, { Component, Fragment } from "react";
import OtpInput from 'react-otp-input';

export default class WrOtpInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <OtpInput
          numInputs={5}
          containerStyle="wr-otp-container"
          inputStyle="wr-otp-input"
          onChange={this.props.onChange}
          hasErrored={!!this.props.errorText}
          value={this.props.value}
        />
        {this.props.errorText &&
          <div style={{ color: 'red', margin: '14px 0 0 0', fontSize: '16px' }}>
          {this.props.errorText}
          </div>
        }
      </Fragment>
    );
  }
}