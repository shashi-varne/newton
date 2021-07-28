import './commonStyles.scss';
import React from 'react';
import WVOtp from '../../common/ui/Otp/WVOtp';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';

const EnterMPin = ({
    otpProps = {},
    title = '',
    subtitle = '',
    children,
    noData,
    renderNoData
}) => {
    return (
        <div className="verify-mpin">
            {title &&
                <Title>
                    {title}
                </Title>
            }
            {subtitle &&
                <Subtitle style={{ margin: '20px 0 60px' }}>
                    {subtitle}
                </Subtitle>
            }
            {noData ?
                renderNoData :
                <>
                    {children}
                    <WVOtp
                        additionalOtpProps={{ isInputSecure: true }}
                        onChange={otpProps.handleOtp}
                        value={otpProps.otp}
                        isDisabled={otpProps.isDisabled}
                        hasError={otpProps.hasError}
                        bottomText={otpProps.bottomText}
                        classes={{ container: 'vm-otp-container' }}
                    />
                </>
            }
        </div>
    );
}

const Title = ({ children, ...props }) => {
    return <WVInPageTitle {...props}>{children}</WVInPageTitle>
}
EnterMPin.Title = Title;

const Subtitle = ({ children, ...props }) => {
    return <WVInPageSubtitle {...props}>{children}</WVInPageSubtitle>
}
EnterMPin.Subtitle = Subtitle;

export default EnterMPin;