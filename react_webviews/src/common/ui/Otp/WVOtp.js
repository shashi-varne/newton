import './WVOtp.scss';
import React from 'react';
import OtpInput from "react-otp-input";

const WVOtp = ({
  align = 'center',
  numInputs = 4,
  onChange,
  placeholder = 'X',
  value,
  isDisabled,
  hasError,
  bottomText,
  additionalOtpProps = {},
}) => {
  return (
    <div className="wv-otp-parent-container">
      <div>
        <OtpInput
          hasErrored
          id="wv-otp"
          numInputs={numInputs}
          containerStyle={{
            display: 'flex',
            justifyContent: align,
          }}
          inputStyle="wv-otp-input"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          isDisabled={isDisabled}
          errorStyle={hasError ? "wv-otp-error-style" : ""}
          {...additionalOtpProps}
        />
      </div>
      {bottomText &&
        <span className={hasError ? "wv-otp-error-text" : ""}>
          {bottomText}
        </span>
      }
    </div>
  );
}

export default WVOtp;
