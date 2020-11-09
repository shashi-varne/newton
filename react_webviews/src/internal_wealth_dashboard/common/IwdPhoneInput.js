import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const IwdPhoneInput = (props) => {
  return (
    <PhoneInput 
      country={'in'}
      disabled={props.disabled}
      autoFormat={true}
      inputProps={{
        autoFocus: true
      }}
      countryCodeEditable={false}
      enableSearch={true}
      containerClass={props.containerClass}
      inputClass={`iwd-phone-input ${props.inputClass}`}
      buttonClass={`iwd-phone-btn ${props.buttonClass}`}
      {...props}
    />
  );
}

export default IwdPhoneInput;