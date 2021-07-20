import React from 'react';
import { Imgc } from '../../common/ui/Imgc';
import WVOtp from '../../common/ui/Otp/WVOtp';

const VerifyMPin = ({
    otpProps = {}
}) => {
    return (
        <div className="verify-otp-container">
            <Imgc
                src={require(`assets/padlock1.svg`)}
                alt=""
                className="img-lock"
            />
            <p className="reset-title">Enter your current fisdom PIN</p>
            <WVOtp
                handleOtp={otpProps.handleOtp}
                value={otpProps.otp}
                isDisabled={otpProps.isDisabled}
                hasError={otpProps.hasError}
                bottomText={otpProps.otpBottomText}
            />
        </div>
    );
}

export default VerifyMPin;