import "./commonStyles.scss"
import React, { useState } from 'react';
import { validateNumber } from "utils/validators";
import Input from "common/ui/Input";
import WVInPageSubtitle from "common/ui/InPageHeader/WVInPageSubtitle";
import WVInPageHeader from "../../common/ui/InPageHeader/WVInPageHeader";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";

const ForgotMPin = ({
    primaryAuthType,
    primaryAuthValue,
    isPANRequired,
    PANError,
}) => {
    const [formData, setFormData] = useState({});
        
    const handleChange = (name) => (event) => {
        let value = event.target ? event.target.value : event;
        if (name === "mobile" && value && !validateNumber(value)) return;
        let formDataCopy = {...formData};
        formDataCopy[name] = value;
        formDataCopy[`${name}_error`] = "";
        setFormData(formDataCopy)
    };
    
    return (
        <div className="forgot-fisdom-pin">
            <WVInPageHeader>
                <WVInPageTitle>Forgot fisdom PIN</WVInPageTitle>
                <WVInPageSubtitle>OTP will be sent to your registered mobile number</WVInPageSubtitle>
            </WVInPageHeader>   

            <div className="login-form-field">
                <span className="input-field">
                    <Input
                        error={formData.mobile_error ? true : false}
                        type="text"
                        value={formData.mobile || ""}
                        helperText={formData.mobile_error || ""}
                        class="input mobile-number"
                        id="mobile"
                        label="Enter mobile number"
                        name="mobile"
                        onChange={handleChange("mobile")}
                        inputMode="numeric"
                        // disabled={true}
                        autoFocus
                    />
                </span>
                <span className="input-field">
                    <Input
                        error={formData.pan_number ? true : false}
                        type="text"
                        value={formData.pan_number || ""}
                        helperText={formData.pan_number_error || ""}
                        class="input pan-number"
                        id="pan_number"
                        label="Enter registered PAN number"
                        name="pan_number"
                        onChange={handleChange("pan")}
                        inputMode="numeric"
                        // disabled={true}
                        autoFocus
                    />
                    <WVInPageSubtitle className="forgot-pin-subtitle" children={"Enter PAN number to confirm your account"} />
                </span>
            </div>
        </div>
    );
};

export default ForgotMPin;