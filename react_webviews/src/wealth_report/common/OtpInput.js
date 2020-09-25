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
          numInputs={4}
          inputStyle="wr-otp-input"
          onChange={this.props.onChange}
          hasErrored={!!this.props.errorText}
          value={this.props.value}
          shouldAutoFocus={true}
          onKeyDown={this.props.onKeyDown}
        />
        {this.props.errorText &&
          <div style={{ color: 'red', margin: '14px 0 0 0', fontSize: '14px' }}>
          {this.props.errorText}
          </div>
        }
      </Fragment>
    );
  }
}