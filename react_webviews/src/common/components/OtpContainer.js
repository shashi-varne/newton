import "./OtpContainer.scss";
import React, { useEffect, useState } from "react";
import WVInPageTitle from "../ui/InPageHeader/WVInPageTitle";
import WVClickableTextElement from "../ui/ClickableTextElement/WVClickableTextElement";
import WVOtp from "../ui/Otp/WVOtp";
import DotDotLoader from "../ui/DotDotLoaderNew";

const OtpContainer = ({
    title,
    otpData,
    handleClick,
    handleOtp,
    showDotLoader,
    resendOtp,
    isWrongOtp,
    value,
    isDisabled,
    children,
    classes = {},
    handleClickText,
}) => {
    const [timeAvailable, setTimeAvailable] = useState(otpData?.timeAvailable);
    useEffect(() => {
        if (!!showDotLoader) {
            setTimeAvailable(otpData?.timeAvailable)
        }
        const timer = setTimeout(() => {
            if (timeAvailable <= 0) {
                clearTimeout(timer);
                return;
            }
            setTimeAvailable(timeAvailable - 1)
        }, 1000);
    }, [timeAvailable, showDotLoader])

    return (
        <div className={`verify-otp-container ${classes.body}`}>
            {title &&
                <WVInPageTitle>{title}</WVInPageTitle>
            }
            <div className={`verify-otp-header ${classes.subtitle}`}>
                <p>
                    An OTP has been sent to{" "}
                    <span style={{ fontWeight: "500", marginRight: "23px" }}>
                        {value}
                    </span>
                </p>
                {handleClickText &&
                    <WVClickableTextElement onClick={handleClick}>{handleClickText}</WVClickableTextElement>}
            </div>
            <div className="kcd-otp-content">
                <div className="communication-details-otp-container">
                    <WVOtp
                        id="default-otp"
                        align="left"
                        onChange={handleOtp}
                        hasErrored={true}
                        placeholder=""
                        value={otpData.otp}
                        isDisabled={isDisabled || false}
                        hasError={isWrongOtp}
                        bottomText={isWrongOtp ? "Invalid OTP" : ""}
                    // TODO: Support custom bottomText ^
                    />
                    {timeAvailable > 0 && !showDotLoader && (
                        <div className="cd-otp-time-text">
                            OTP should arrive within{" "}
                            {timeAvailable < 10 ? `0${timeAvailable}` : timeAvailable}s
                        </div>
                    )}
                    {(timeAvailable <= 0 || !timeAvailable || showDotLoader) && (
                        <div
                            className={`cd-otp-resend-text ${classes.resendText}`}
                            onClick={() => {
                                resendOtp();
                                setTimeAvailable(otpData?.timeAvailable);
                            }}
                        >
                            {showDotLoader ? (
                                <DotDotLoader className="cd-resend-loader" />
                            ) : (
                                    "RESEND OTP"
                                )}
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

export default OtpContainer;