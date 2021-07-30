import InputAdornment from "@material-ui/core/InputAdornment";
import React, { useEffect, useState } from "react";
import Container from "../../common/Container";
import TextField from "@material-ui/core/TextField";
import "./commonStyles.scss";
import {
  getContactsFromSummary,
  resendOtp,
  sendOtp,
  sendWhatsappConsent,
  verifyOtp,
  authCheckApi,
  sendGoldOtp,
  resendGoldOtp,
  verifyGoldOtp,
  comfirmVerification,
} from "../../common/api";
import toast from "../../../common/ui/Toast";
import {
  isEmpty,
  storageService,
  validateEmail,
  validateNumber,
} from "../../../utils/validators";
import useUserKycHook from "../../common/hooks/userKycHook";
import CheckBox from "../../../common/ui/Checkbox";
import { PATHNAME_MAPPER } from "../../constants";
import { navigate as navigateFunc } from "../../../utils/functions";
import Otp from "../mini-components/Otp";
import { nativeCallback } from "../../../utils/native_callback";
import {
  getTotalPagesInPersonalDetails,
  isDigilockerFlow,
} from "../../common/functions";
import AccountAlreadyExistDialog from "../../../login_and_registration/components/AccountAlreadyExistDialog";
// import WVButton from "../../../common/ui/Button/WVButton";

// const config = getConfig();
// const googleRedirectUrl = `${config.base_url}${API_CONSTANTS.socialAuth}/google?redirect_url=${encodeURIComponent(`${getBasePath()}/kyc/communication-details/callback${config.searchParams}`)}`;
// const googleButtonTitle = (
//   <a className="kcd-google-text" href={googleRedirectUrl}>
//     <img src={require(`assets/google.svg`)} alt="google" />
//     <div>Continue with Google</div>
//   </a>
// );
const CommunicationDetails = (props) => {
  const navigate = navigateFunc.bind(props);
  const stateParams = props.location?.state || {};
  const isEdit = stateParams.isEdit || false;
  const userType = stateParams.userType || "";
  const callHandleClick = stateParams.callHandleClick;
  const [goldUserInfo, setGoldUserInfo] = useState(stateParams?.user_info);
  const accountAlreadyExistsData = stateParams.accountAlreadyExistsData;
  const [formData, setFormData] = useState({
    whatsappConsent: true,
  });
  const [otpData, setOtpData] = useState({
    otp: "",
    otpId: "",
  });
  const [buttonTitle, setButtonTitle] = useState("CONTINUE");
  const [showLoader, setShowLoader] = useState(false);
  const [showOtpContainer, setShowOtpContainer] = useState(false);
  const [showDotLoader, setShowDotLoader] = useState(false);
  const [showSkelton, setShowSkelton] = useState(false);
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const isNri = kyc?.address?.meta_data?.is_nri || false;
  const [communicationType, setCommunicationType] = useState("");
  const [isKycDone, setIsKycDone] = useState();
  const [totalPages, setTotalPages] = useState();
  const [isDlFlow, setIsDlFlow] = useState();
  const [continueAccountAlreadyExists, setContinueAccountAlreadyExists] = useState(false);
  const [accountAlreadyExists, setAccountAlreadyExists] = useState(false);
  const [goldVerificationLink, setVerificationLink] = useState();
  const [goldResendVerificationOtpLink, setGoldResendVerificationOtpLink] = useState();
  const [authCheckRequired, setAuthCheckRequired] = useState(true);

  useEffect(() => {
    if (!isEmpty(kyc) && !continueAccountAlreadyExists) {
      initialize();
    }
    if (!isEmpty(goldUserInfo)) {
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
      else if (goldUserInfo?.email_verified || !goldUserInfo?.email) {
        setCommunicationType("email")
        data.email = kyc.identification.meta_data.email || goldUserInfo?.email || "";
      }
      setFormData({ ...data });
    }
    if ((callHandleClick && communicationType) || continueAccountAlreadyExists) handleClick();
  }, [kyc, communicationType, continueAccountAlreadyExists, goldUserInfo]);

  const initialize = async () => {
    setIsKycDone(kyc?.mf_kyc_processed);
    setIsDlFlow(isDigilockerFlow(kyc));
    setTotalPages(getTotalPagesInPersonalDetails());
    if (showOtpContainer) {
      setShowOtpContainer(false);
    }
    const type = !kyc.identification.meta_data.email_verified
      ? "email"
      : "mobile";
    setCommunicationType(type);
    const data = { ...formData };
    if (type === "email") {
      data.email = kyc.identification.meta_data.email;
    } else {
      let mobileNumber = kyc.identification.meta_data.mobile_number || "";
      const [extension, number] = mobileNumber.toString().split("|");
      if (extension) mobileNumber = number;
      data.mobile = mobileNumber;
      data.mobileNumberVerified =
        kyc.identification.meta_data.mobile_number_verified;
      if (data.mobileNumberVerified) {
        data.contact_id = await getContactId(number);
      };
    }
    if (accountAlreadyExistsData) {
      if (type === "email") {
        data.email = accountAlreadyExistsData?.contact_value
      } else {
        data.mobile = accountAlreadyExistsData?.contact_value
      }
    }
    setFormData({ ...data });
  };

  const getContactId = async (number) => {
    let contacts = storageService().getObject("contacts") || {};
    if (isEmpty(contacts)) {
      setShowSkelton(true);
      try {
        const result = await getContactsFromSummary();
        contacts = result.data?.contacts?.contacts?.data || {};
      } catch (err) {
        toast(err.message);
      } finally {
        setShowSkelton(false);
      }
    }
    const contact =
      contacts?.verified_mobile_contacts?.find((element) => {
        const mobileNumber = element.contact_value?.split("|")[1];
        return mobileNumber === number;
      }) || {};
    return contact.id;
  };

  const handleChange = (name) => (event) => {
    if (showOtpContainer || showDotLoader) {
      return;
    }
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

  const resendOtpVerification = async () => {
    sendEvents("resend");
    setShowDotLoader(true);
    try {
      if (!isEmpty(goldUserInfo)) {
        await resendGoldOtp(goldResendVerificationOtpLink);
      } else {
        const result = await resendOtp(otpData.otpId);
        setOtpData({
          otp: "",
          otpId: result.otp_id,
        });
      }
    } catch (err) {
      toast(err.message);
    } finally {
      setShowDotLoader(false);
    }
  };

  const handleOtp = (otp) => {
    if (otp && !validateNumber(otp)) return;
    setOtpData({ ...otpData, otp });
  };

  const otpVerification = async () => {
    try {
      if (otpData.otp.length !== 4) {
        toast("Minimum otp length is 4");
        return;
      }
      setShowLoader("button");
      const otpResult = await verifyOtp(otpData);
      updateKyc(otpResult.kyc);
      if (
        otpResult.kyc.identification.meta_data.mobile_number_verified &&
        otpResult.kyc.identification.meta_data.email_verified
      ) {
        handleNavigation();
      }
    } catch (err) {
      toast(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  const getPayLoad = () => {
    let body = {};
    if (communicationType === "email") {
      if (!formData.email) {
        toast("Email is mandatory!");
        return;
      }
      if (!validateEmail(formData.email)) {
        toast("Please enter valid email");
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
  const handleClick = async () => {
    sendEvents("next");
    if (
      formData.mobileNumberVerified &&
      kyc.identification.meta_data.email_verified &&
      kyc.whatsapp_consent
    ) {
      handleNavigation();
      return;
    }
    try {
      if (showOtpContainer) {
        await otpVerification();
      } else {
        const body = getPayLoad();
        if (!body) return;
        if (communicationType === "mobile" && formData.mobileNumberVerified) {
          if (formData.whatsappConsent === kyc.whatsapp_consent) {
            handleNavigation();
            return;
          }
          setShowLoader("button");
          const contactResult = await sendWhatsappConsent(body);
          const whatsappConsent =
            contactResult?.contact_details?.whatsapp_consent;
          updateKyc({ ...kyc, whatsapp_consent: whatsappConsent });
          handleNavigation();
          return;
        }
        setShowLoader("button");
        if (!continueAccountAlreadyExists && !stateParams.continueAccountAlreadyExists) {
          const result = await authCheckApi(body, communicationType);
          if (result.is_user) {
            userFound(result);
            setShowLoader(false);
            return
          }
        }
        const result = await sendOtp(body);
        setShowOtpContainer(true);
        setOtpData({
          otp: "",
          otpId: result.otp_id,
        });
        setButtonTitle("VERIFY");
      }
    } catch (err) {
      toast(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  const handleEdit = (noevent) => {
    setAuthCheckRequired(true);
    if (!noevent) sendEvents("edit");
    if (showDotLoader) return;
    setAccountAlreadyExists(false)
    sendEvents("edit");
    if (showDotLoader) return;
    setShowOtpContainer(false);
    setButtonTitle("CONTINUE");
  };

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

  const handleNavigation = () => {
    if (stateParams?.fromState === "/my-account") {
      navigate(stateParams?.goBack);
      return;
    }
    if (isKycDone) {
      navigate(PATHNAME_MAPPER.tradingExperience);
      return;
    }
    const data = {
      state: {
        isEdit,
        userType,
      },
    };
    if (userType === "compliant") {
      if (isNri) {
        navigate(PATHNAME_MAPPER.nriAddressDetails2, data);
      } else {
        navigate(PATHNAME_MAPPER.compliantPersonalDetails4, data);
      }
    } else if (isDlFlow) {
      navigate(PATHNAME_MAPPER.digilockerPersonalDetails3, data);
    } else {
      navigate(PATHNAME_MAPPER.personalDetails4, data);
    }
  };

  const onClickbottomSheet = () => {
    setAccountAlreadyExists(false)
    if (!isEmpty(goldUserInfo)) return handleClickGold();
    setContinueAccountAlreadyExists(true)
  }


  const handleClickGold = async () => {
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
        handleGoldNavigation();
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

  const handleGoldNavigation = async () => {
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

  const pageNumber = isDlFlow ? 3 : 4;
  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle={buttonTitle}
      title="Communication details"
      count={!isKycDone && pageNumber}
      current={pageNumber}
      total={!isKycDone && totalPages}
      handleClick={!isEmpty(goldUserInfo) ? handleClickGold : handleClick}
      showLoader={showLoader}
      skelton={isLoading || showSkelton}
      disable={showDotLoader}
    >
      <div
        className={`kyc-communication-details ${communicationType === "mobile" &&
          !showOtpContainer &&
          "kyc-communication-details-mobile"
          }`}
      >
        <div>
          <div className="kyc-main-subtitle">
            {communicationType === "email" ? "Email" : "Mobile"} verification is
            mandatory for investment as per SEBI
          </div>
          {communicationType === "email" ? (
            <>
              {/* {!showOtpContainer && (
                <>
                  <WVButton
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    classes={{ root: "kcd-google-button" }}
                  >
                    {googleButtonTitle}
                  </WVButton>
                  <img
                    src={require("assets/ORDivider.svg")}
                    alt=""
                    className="kcd-or-divider"
                  />
                </>
              )} */}
              <TextField
                label="Email address"
                value={formData.email || ""}
                error={formData.email_error ? true : false}
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
            <div>
              I agree to receive important investment updates on WhatsApp
            </div>
          </div>
        )}
      </div>
      {accountAlreadyExists && (
        <AccountAlreadyExistDialog
          type={communicationType}
          data={accountAlreadyExists}
          isOpen={accountAlreadyExists}
          onClose={() => handleEdit(false)}
          editDetails={handleEdit}
          next={onClickbottomSheet}
        ></AccountAlreadyExistDialog>
      )}
    </Container>
  );
};

export default CommunicationDetails;
