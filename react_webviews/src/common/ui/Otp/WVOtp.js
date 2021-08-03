import './WVOtp.scss';
import React from 'react';
import OtpInput from "react-otp-input";

const WVOtp = ({
  align = 'center',
  numInputs = 4,
  onChange,
  placeholder = '',
  value,
  isDisabled,
  hasError,
  bottomText,
  classes = {},
  additionalOtpProps = {},
}) => {
  return (
    <div
      className={`wv-otp-parent-container ${classes.container}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align
      }}
    >
      <div>
        <OtpInput
          hasErrored
          id="wv-otp"
          numInputs={numInputs}
          inputStyle="wv-otp-input"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          isDisabled={isDisabled}
          errorStyle={hasError ? "wv-otp-error-style" : ""}
          {...additionalOtpProps}
        />
      </div>
      <div
        className={`
          wv-otp-text 
          ${hasError ? `wv-otp-text-error ${classes.bottomTextError}` : ''} 
          ${classes.bottomText}
        `}
        style={{ textAlign: align }}
      >
        {bottomText}
      </div>
    </div>
  );
}

export default WVOtp;
