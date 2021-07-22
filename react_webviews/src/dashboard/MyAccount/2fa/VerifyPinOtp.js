import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import OtpContainer from "../../../common/components/OtpContainer";
import toast from "../../../common/ui/Toast"
import TwoFaCtaButton from "./common/TwoFaCtaButton";
import { navigate as navigateFunc } from "../../../utils/functions";

const VerifyPinOtp = (props) => {
    const navigate = navigateFunc.bind(props);
    const [isApiRunning, setIsApiRunning] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpData, setOtpData] = useState({ timeAvailable: 15 })
    const [value, setValue] = useState(false)
    const [otpid, setOtpid] = useState(false)
    const [communicationType, setCommunicationType] = useState(false)

    useEffect(() => {
        let { state } = props.location || {};
        if (!state) {
            toast("Mobile number not provided");
            props.history.goBack();
            return;
        }
        let { value, otp_id, communicationType } = state;
        setValue(value)
        setOtpid(otp_id)
        setCommunicationType(communicationType)
    }, [])



    const handleClick = (route) => {
        // Api Call 
        console.log("HI")
    };


    const handleOtp = (otp) => {
        setOtp(otp);
    };

    const goBack = () => navigate('/forgot-fisdom-pin', {
        state: {
            communicationType: communicationType,
            contactValue: value,
            edit: true,
        }
    })

    const handleResendOtp = () => {
        // Re-send Otp Api Call 
        setOtpData({ otpData: { ...otpData, timeAvailable: 15, }, });
    }


    return (
        <Container
            title={<Title communicationType={communicationType} />}
            buttonTitle="VERIFY"
            showLoader={isApiRunning}
            noFooter={true}
        >
            <OtpContainer
                handleClickText={"EDIT"}
                handleClick={goBack}
                classes={{
                    body: "verify-otp-pin-container"
                }}
                otpData={otpData}
                showDotLoader={isApiRunning}
                handleOtp={handleOtp}
                resendOtp={handleResendOtp}
                // isWrongOtp={isWrongOtp}                          // need API 
                // bottomText={isWrongOtp ? "Invalid OTP" : ""}    // need API
                value={value}>
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

export default VerifyPinOtp;

const Title = (props) =>
    <div className="verify-otp-pin-container">
        {`Enter OTP to verify your ${props.communicationType === "email" ? "email" : "number"}`}
    </div>