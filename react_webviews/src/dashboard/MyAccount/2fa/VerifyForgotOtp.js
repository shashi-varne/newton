import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import Toast from "../../../common/ui/Toast";
import OtpContainer from "../../../common/components/OtpContainer";
import { nativeCallback } from "../../../utils/native_callback";
import { navigate as navigateFunc } from "../../../utils/functions";
import { twofaPostApi } from '../../../2fa/common/apiCalls';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';

const VerifyForgotOtp = (props) => {
    const { routeParams, persistRouteParams } = usePersistRouteParams();
    const authType = routeParams.obscured_auth_type === 'mobile' ? 'mobile' : 'email';
    const authValue = routeParams.obscured_auth;
    const otpData = {
        totalTime: 15,
        timeAvailable: 15,
    };
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isApiRunning, setIsApiRunning] = useState(false);
    const [isResendApiRunning, setIsResendApiRunning] = useState(false);

    const navigate = navigateFunc.bind(props);

    const handleOtp = (value) => {
        setOtp(value);
        setOtpError(false);
    }

    const handleClick = async () => {
        try {
            setIsApiRunning("button");
            const result = await twofaPostApi(routeParams?.verify_url, { otp });
            setIsApiRunning(false);
            persistRouteParams({reset_url: result.reset_url})
            sendEvents("next");
            navigate('new-pin', {
                edit: true,
                // ^ to replace this path with next screen's path so that on click of 'back' this screen is skipped
            });
        } catch (err) {
            console.log(err);
            setOtpError(err);
        } finally {
            setIsApiRunning(false);
        }
    }

    const handleResendOtp = async () => {
        try {
            setIsResendApiRunning(true);
            await twofaPostApi(routeParams?.resend_url);
            handleOtp('');
        } catch (err) {
            console.log(err);
            Toast(err);
        } finally {
            setIsResendApiRunning(false);
        }
    }

    const sendEvents = (user_action) => {
        let eventObj = {
            "event_name": '2fa',
            "properties": {
                "user_action": user_action,
                "screen_name": 'OTP_verification',
                "verification_type": authType,
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };


    return (
        <Container
            events={sendEvents("just_set_events")}
            title={`Enter OTP to verify your ${authType === "email" ? "email" : "number"}`}
            buttonTitle="VERIFY"
            showLoader={isApiRunning}
            handleClick={handleClick}
            disable={otp?.length !== 4}
        >
            <OtpContainer
                otpData={{ ...otpData, otp }}
                showDotLoader={isResendApiRunning}
                handleOtp={handleOtp}
                resendOtp={handleResendOtp}
                isWrongOtp={!!otpError}
                bottomText={!!otpError ? "Invalid OTP" : ""}
                value={authValue}>
            </OtpContainer>
        </Container>
    )
};

export default VerifyForgotOtp;