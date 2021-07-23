import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import Toast from "../../../common/ui/Toast";
import OtpContainer from "../../../common/components/OtpContainer";
import TwoFaCtaButton from "./common/TwoFaCtaButton";
import { navigate as navigateFunc } from "../../../utils/functions";
import { otpApiCall } from '../../../2fa/common/ApiCalls';

const VerifyForgotOtp = (props) => {
    const routeParams = props.location.params || {};
    // TODO: handle direct landing on this page gracefully => routeParams is empty
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
    }

    const handleClick = async () => {
        try {
            setIsApiRunning(true);
            const result = await otpApiCall(routeParams?.verify_url, otp);
            setIsApiRunning(false);
            navigate('new-pin', {
                params: { modify_url: result.modify_url }
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
            await otpApiCall(routeParams?.resend_url);
        } catch (err) {
            console.log(err);
            Toast(err);
        } finally {
            setIsResendApiRunning(false);
        }
    }


    return (
        <Container
            title={<Title authType={authType} />}
            buttonTitle="VERIFY"
            showLoader={isApiRunning}
            noFooter={true}
        >
            <OtpContainer
                classes={{
                    body: "verify-otp-pin-container"
                }}
                otpData={{ ...otpData, otp }}
                showDotLoader={isApiRunning}
                handleOtp={handleOtp}
                resendOtp={handleResendOtp}
                isWrongOtp={!!otpError}
                bottomText={!!otpError ? "Invalid OTP" : ""}
                value={authValue}>
            </OtpContainer>
            <TwoFaCtaButton
                onClick={handleClick}
                disable={otpData.otp?.length === 4 ? false : true}
                // disabled={!otp}
                showLoader={isApiRunning}
                className="two-fa-cta-btn"
            >
                Continue
            </TwoFaCtaButton>
        </Container>
    )
};

export default VerifyForgotOtp;

const Title = (props) =>
    <div className="verify-otp-pin-container">
        {`Enter OTP to verify your ${props.authType === "email" ? "email" : "number"}`}
    </div>