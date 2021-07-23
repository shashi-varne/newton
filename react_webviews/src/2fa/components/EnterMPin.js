import './commonStyles.scss';
import React from 'react';
import WVOtp from '../../common/ui/Otp/WVOtp';

const EnterMPin = ({
    otpProps = {},
    title = '',
    subtitle = '',
    children
}) => {
    return (
        <div className="verify-mpin">
            {title &&
                <Title className="vm-title">
                    {title}
                </Title>
            }
            {subtitle &&
                <Subtitle className="vm-subtitle">
                    {subtitle}
                </Subtitle>
            }
            {children}
            <WVOtp
                onChange={otpProps.handleOtp}
                value={otpProps.otp}
                isDisabled={otpProps.isDisabled}
                hasError={otpProps.hasError}
                bottomText={otpProps.bottomText}
                classes={{ container: 'vm-otp-container' }}
            />
        </div>
    );
}

const Title = ({ children, ...props }) => {
    return <div {...props}>{children}</div>
}
EnterMPin.Title = Title;

const Subtitle = ({ children, ...props }) => {
    return <div {...props}>{children}</div>
}
EnterMPin.Subtitle = Subtitle;

export default EnterMPin;