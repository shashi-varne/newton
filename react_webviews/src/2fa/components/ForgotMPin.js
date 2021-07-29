import "./commonStyles.scss"
import React from 'react';
import Input from "common/ui/Input";
import WVInPageSubtitle from "common/ui/InPageHeader/WVInPageSubtitle";
import WVInPageHeader from "../../common/ui/InPageHeader/WVInPageHeader";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import UiSkelton from "../../common/ui/Skelton";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";

const ForgotMPin = ({
    primaryAuthType,
    primaryAuthValue,
    isPanRequired,
    pan,
    onPanInputChange,
    panError,
    isLoading,
    noData,
    renderNoData
}) => {
    const authTypeText = primaryAuthType === 'mobile' ? 'mobile number' : 'email';

    const handleChange = (event) => {
        const value = event.target ? event.target.value : event;
        onPanInputChange(value);
    };

    if (noData) {
        return (
            <div className="forgot-fisdom-pin">
                <WVInPageHeader>
                    <WVInPageTitle>Forgot fisdom PIN</WVInPageTitle>
                    <WVInPageSubtitle>OTP will be sent to your registered {authTypeText}</WVInPageSubtitle>
                </WVInPageHeader>
                {renderNoData || ''}
            </div>
        );
    }
    
    return (
        <div className="forgot-fisdom-pin">
            <WVInPageHeader>
                <WVInPageTitle>Forgot fisdom PIN</WVInPageTitle>
                <WVInPageSubtitle>OTP will be sent to your registered {authTypeText}</WVInPageSubtitle>
            </WVInPageHeader>
            {isLoading ? 
                <UiSkelton type="inputs" /> :
                <div className="login-form-field">
                    <span className="input-field">
                        <Input
                            type="text"
                            value={primaryAuthValue || ""}
                            class="input mobile-number"
                            id="mobile"
                            label={`Registered ${authTypeText}`}
                            name="mobile"
                            disabled
                            autoFocus
                        />
                    </span>
                    {isPanRequired &&
                        <>
                            <span className="input-field">
                                <Input
                                    error={!!panError}
                                    type="text"
                                    value={pan}
                                    helperText={panError || "Enter PAN number to confirm your account"}
                                    class="input pan-number"
                                    id="pan_number"
                                    label="Enter registered PAN number"
                                    name="pan_number"
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </span>
                            {panError &&
                                <WVInfoBubble type="error" style={{ marginTop: '40px' }}>
                                    Entered details do not match with any of our accounts
                                </WVInfoBubble>
                            }
                        </>
                    }
                </div>
            }
        </div>
    );
};

export default ForgotMPin;