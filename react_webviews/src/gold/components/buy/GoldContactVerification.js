// import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "../../common/Container";
import { navigate as navigateFunc } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import TextField from "@material-ui/core/TextField";
import CheckBox from "../../../common/ui/Checkbox";
import toast from "../../../common/ui/Toast";
import Otp from "../../../kyc/Equity/mini-components/Otp";
import useUserKycHook from "../../../kyc/common/hooks/userKycHook";
import AccountAlreadyExistDialog from "../../../login_and_registration/components/AccountAlreadyExistDialog";
import {
    validateEmail,
    validateNumber,
} from "../../../utils/validators";
import {
    sendGoldOtp,
    resendGoldOtp,
    verifyGoldOtp,
    comfirmVerification,
} from "../../common/api";
import { sendWhatsappConsent, authCheckApi } from "../../../kyc/common/api";

const GoldContactVerification = (props) => {
    const navigate = navigateFunc.bind(props);
    const stateParams = props.location?.state || {};
    const [goldUserInfo, setGoldUserInfo] = useState(stateParams?.user_info);
    const [showDotLoader, setShowDotLoader] = useState(false);
    const [buttonTitle, setButtonTitle] = useState("CONTINUE");
    const [communicationType, setCommunicationType] = useState("");
    const [goldVerificationLink, setVerificationLink] = useState();
    const [goldResendVerificationOtpLink, setGoldResendVerificationOtpLink] = useState();
    const [authCheckRequired, setAuthCheckRequired] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    const [accountAlreadyExists, setAccountAlreadyExists] = useState(false);
    const [showOtpContainer, setShowOtpContainer] = useState(false);
    const [error, setError] = useState(false);
    const { kyc } = useUserKycHook();


    const [formData, setFormData] = useState({
        whatsappConsent: true,
    });
    const [otpData, setOtpData] = useState({
        otp: "",
        otpId: "",
    });

    useEffect(() => {
        const data = { ...formData };
        setShowOtpContainer(false);
        if (goldUserInfo?.email && goldUserInfo?.mobile_no) {
            sendEvents("next")
            navigate(stateParams?.goto)
        }
        else if (!goldUserInfo?.mobile_number_verified || !!goldUserInfo?.registered_with_another_account || !goldUserInfo?.mobile_no) {
            setCommunicationType("mobile")
            let mobileNumber = kyc.identification.meta_data.mobile_number || goldUserInfo?.mobile_no || "";
            const [extension, number] = mobileNumber.toString().split("|");
            if (extension) mobileNumber = number;
            data.mobile = mobileNumber;
        }
        else if (goldUserInfo?.email_verified || !goldUserInfo?.email ) {
            setCommunicationType("email")
            data.email = kyc.identification.meta_data.email || goldUserInfo?.email || "";
        }
        setFormData({ ...data });
    }, [goldUserInfo]);


    const getPayLoad = () => {
        let body = {};
        if (communicationType === "email") {
            if (!formData.email) {
                toast("Email is mandatory!");
                setError(true)
                return;
            }
            if (!validateEmail(formData.email)) {
                toast("Please enter valid email");
                setError(true)
                return;
            }
            body.email = formData.email;
        } else {
            if (!formData.mobile) {
                toast("Mobile number is mandatory!");
                return;
            }
            if (formData.mobile.length !== 10) {
                toast("Mobile number must contains 10 digits");
                return;
            }
            if (formData.mobileNumberVerified) {
                body.consent = formData.whatsappConsent;
                body.communication_type = "whatsapp";
                body.contact_id = formData.contact_id;
            } else {
                body.mobile = formData.mobile;
                body.whatsapp_consent = formData.whatsappConsent;
            }
        }
        return body;
    };

    const userFound = (data) => {
        setAccountAlreadyExists(data?.user)
    }

    const onClickbottomSheet = () => {
        setAccountAlreadyExists(false)
        handleClick()
    }

    const handleClick = async () => {
        setShowLoader("button");
        sendEvents("next");
        try {
            if (showOtpContainer) {
                if (otpData.otp.length !== 4) {
                    toast("Minimum otp length is 4");
                    return;
                }
                let body = {
                    verify_link: goldVerificationLink,
                    otp: otpData?.otp,
                }
                await verifyGoldOtp(body);
                handleNavigation();
            } else {
                const body = getPayLoad();
                if (!body) return;
                if (authCheckRequired) {
                    const result = await authCheckApi(body, communicationType);
                    if (result.is_user) {
                        userFound(result);
                        setShowLoader(false);
                        setAuthCheckRequired(false);
                        return
                    }
                }
                await callGoldOtp(body)
            }
        } catch (err) {
            toast(err?.message);
        } finally {
            setShowLoader(false);
        }
    };

    const callGoldOtp = async (body) => {
        try {
            setAuthCheckRequired(true);
            setShowLoader("button");
            const result = await sendGoldOtp(body);
            setVerificationLink(result?.verification_link);
            setGoldResendVerificationOtpLink(result?.resend_verification_otp_link);
            setShowOtpContainer(true);
            setButtonTitle("VERIFY");
            setOtpData({
                otp: "",
                otpId: result.otp_id,
            });
            if (communicationType === "mobile" && formData.whatsappConsent) {
                await sendWhatsappConsent(body);
            }
        } catch (err) {
            console.log(err);
            toast(err.message)
        } finally {
            setShowLoader(false)
        }
    }


    const handleNavigation = async () => {
        const url = '/api/gold/user/account/mmtc';
        try {
            const result = await comfirmVerification(url);
            const user_info = result.gold_user_info.user_info || {};
            setGoldUserInfo(user_info)
        } catch (err) {
            console.log(err)
            toast(err.message)
        }
    }


    const sendEvents = (userAction) => {
        let eventObj = {
            event_name: "kyc_registration",
            properties: {
                user_action: userAction || "",
                screen_name: showOtpContainer
                    ? "communication_details_otp"
                    : "communication_details",
            },
        };
        if (showOtpContainer) {
            eventObj.properties.otp_entered = otpData.otp ? "yes" : "no";
            eventObj.properties.mode_entry = "manual";
        } else {
            if (communicationType === "email") {
                eventObj.properties[`email_entered`] = formData.email ? "yes" : "no";
            } else {
                eventObj.properties[`mobile_entered`] = formData.mobile ? "yes" : "no";
                eventObj.properties["whatsapp_agree"] = formData.whatsappConsent
                    ? "yes"
                    : "no";
            }
        }
        if (userAction === "just_set_events") {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };


    const handleChange = (name) => (event) => {
        if (showOtpContainer || showDotLoader) {
            return;
        }
        setError(false)
        let data = { ...formData };
        if (name === "whatsappConsent") {
            data[name] = !formData[name];
        } else {
            const value = event.target ? event.target.value : event;
            if (
                name === "mobile" &&
                value &&
                (!validateNumber(value) || value.length > 10)
            ) {
                return;
            }
            data[name] = value;
        }
        data[`${name}_error`] = "";
        setFormData({ ...data });
    };

    const handleOtp = (otp) => {
        if (otp && !validateNumber(otp)) return;
        setOtpData({ ...otpData, otp });
    };

    const handleEdit = (noevent) => {
        setAuthCheckRequired(true);
         if(!noevent) sendEvents("edit");
        if (showDotLoader) return;
        setAccountAlreadyExists(false)
        setShowOtpContainer(false);
        setButtonTitle("CONTINUE");
    };

    const resendOtpVerification = async () => {
        sendEvents("resend");
        setShowDotLoader(true);
        try {
            await resendGoldOtp(goldResendVerificationOtpLink);
        } catch (err) {
            toast(err.message);
        } finally {
            setShowDotLoader(false);
        }
    };

    return (
        <Container
            title="Communication details"
            events={sendEvents("just_set_events")}
            showLoader={showLoader}
            handleClick={handleClick}
            buttonTitle={buttonTitle}
        >
            <div className={`kyc-communication-details ${communicationType === "mobile" && !showOtpContainer && "kyc-communication-details-mobile"}`}>
                <div>  <div className="kyc-main-subtitle">
                    {communicationType === "email" ? "Email" : "Mobile"} verification is mandatory for investment as per SEBI</div>
                    {communicationType === "email" ? (
                        <>
                            <TextField
                                label="Email address"
                                value={formData.email || ""}
                                error={formData.email_error ? true : false || error}
                                helperText={formData.email_error}
                                onChange={handleChange("email")}
                                type="text"
                                disabled={showLoader}
                                autoFocus
                                className="kcd-input-field"
                                InputProps={{
                                    endAdornment: showOtpContainer && (
                                        <InputAdornment position="end">
                                            <div className="kcd-input-edit" onClick={handleEdit}>
                                                EDIT
                                            </div>
                                        </InputAdornment>
                                    ),
                                }}
                                // eslint-disable-next-line
                                inputProps={{
                                    disabled: showOtpContainer,
                                }}
                            />
                        </>
                    ) : (
                            <TextField
                                label="Mobile number"
                                value={formData.mobile || ""}
                                error={formData.mobile_error ? true : false}
                                helperText={formData.mobile_error}
                                onChange={handleChange("mobile")}
                                type="text"
                                disabled={showLoader || formData.mobileNumberVerified}
                                autoFocus={!formData.mobileNumberVerified}
                                className="kcd-input-field"
                                InputProps={{
                                    endAdornment: showOtpContainer && (
                                        <InputAdornment position="end">
                                            <div className="kcd-input-edit" onClick={handleEdit}>
                                                EDIT
                                           </div>
                                        </InputAdornment>
                                    ),
                                }}
                                // eslint-disable-next-line
                                inputProps={{
                                    disabled: showOtpContainer || formData.mobileNumberVerified,
                                    inputMode: "numeric",
                                }}
                            />
                        )}
                    {!showOtpContainer && (
                        <div className="kcd-email-subtext">
                            {communicationType === "email"
                                ? "We'll keep you updated on your investments"
                                : !formData.mobileNumberVerified
                                    ? "We’ll send an OTP to verify your mobile number"
                                    : ""}
                        </div>
                    )}
                    {showOtpContainer && (
                        <div className="kcd-otp-container">
                            <div className="kcd-email-subtext">
                                Enter OTP sent to above{" "}
                                {communicationType === "email"
                                    ? "email address"
                                    : "mobile number"}
                            </div>
                            <div className="kcd-otp-content">
                                <Otp
                                    otpData={otpData}
                                    totalTime={30}
                                    showDotLoader={showDotLoader}
                                    handleOtp={handleOtp}
                                    resendOtp={resendOtpVerification}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {communicationType === "mobile" && !showOtpContainer && (
                    <div className="kcd-whatsapp-consent">
                        <CheckBox
                            checked={formData.whatsappConsent}
                            value={formData.whatsappConsent}
                            handleChange={handleChange("whatsappConsent")}
                            class="kcd-whatsapp-consent-checkbox"
                        />
                        <div> I agree to receive important investment updates on WhatsApp </div>
                    </div>
                )}
            </div>
            {accountAlreadyExists && (
                <AccountAlreadyExistDialog
                    type={communicationType}
                    data={accountAlreadyExists}
                    isOpen={accountAlreadyExists}
                    onClose={() => handleEdit(true)}
                    editDetails={handleEdit}
                    next={onClickbottomSheet}
                ></AccountAlreadyExistDialog>
            )}
        </Container>
    )
};

export default GoldContactVerification;