import "./commonStyles.scss";
import React from "react";
import OtpComp from "../pages/Otp/Otp";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";

const OtpContainer = ({
    title,
    otpData,
    handleClick,
    showDotLoader,
    handleOtp,
    resendOtp,
    isWrongOtp,
    resend_url,
    value,
    children,
    classes = {},
    handleClickText,
}) => {
    return (
        <div className={`verify-otp-container ${classes.body}`}>
            {title &&
                <p className={`title ${classes.title}`}>{title}</p>}
            <div className={`verify-otp-header ${classes.title}`}>
                <p>
                    An OTP has been sent to{" "}
                    <span style={{ fontWeight: "500", marginRight: "23px" }}>
                        {value}
                    </span>
                </p>
                {handleClickText &&
                    <WVClickableTextElement onClick={() => handleClick()}>{handleClickText}</WVClickableTextElement>}
            </div>
            <div className="kcd-otp-content">
                <OtpComp
                    otpData={otpData}
                    showDotLoader={showDotLoader}
                    handleOtp={handleOtp}
                    resendOtp={resendOtp}
                    isWrongOtp={isWrongOtp}
                    resend_url={resend_url}
                />
            </div>
            {children}
        </div>
    );
}

export default OtpContainer;