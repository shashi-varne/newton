import "./commonStyles.scss";
import React, { useEffect, useState } from "react";
import WVOtp from "../../common/ui/Otp/WVOtp";
import DotDotLoader from "../../common/ui/DotDotLoader";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVInPageHeader from "../../common/ui/InPageHeader/WVInPageHeader";

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
        var timmer = setTimeout(() => {
            if (timeAvailable <= 0) {
                clearTimeout(timmer);
                return;
            }
            setTimeAvailable(timeAvailable - 1)
        }, 1000);
    }, [timeAvailable, showDotLoader])

    return (
        <div className={`verify-otp-container ${classes.body}`}>
            {title && 
                <WVInPageHeader>
                    <WVInPageTitle>{title}</WVInPageTitle>
                </WVInPageHeader>
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
                        placeholder="X"
                        value={otpData.otp}
                        isDisabled={isDisabled || false}
                        hasError={isWrongOtp}
                        bottomText={isWrongOtp ? "Invalid OTP": ""}
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
                            onClick={resendOtp}
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