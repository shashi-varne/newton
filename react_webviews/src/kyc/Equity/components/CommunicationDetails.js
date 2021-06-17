import InputAdornment from "@material-ui/core/InputAdornment";
import React, { useEffect, useState } from "react";
import Container from "../../common/Container";
import TextField from "@material-ui/core/TextField";
import "./commonStyles.scss";
import { resendOtp, sendOtp, verifyOtp } from "../../common/api";
import toast from "../../../common/ui/Toast";
import {
  isEmpty,
  validateEmail,
  validateNumber,
} from "../../../utils/validators";
import useUserKycHook from "../../common/hooks/userKycHook";
import CheckBox from "../../../common/ui/Checkbox";
import { PATHNAME_MAPPER } from "../../constants";
import { navigate as navigateFunc } from "../../../utils/functions";
import Otp from "../mini-components/Otp";
import {
  getTotalPagesInPersonalDetails,
  isDigilockerFlow,
} from "../../common/functions";
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
  const [formData, setFormData] = useState({
    whatsappConsent: true,
  });
  const [otpData, setOtpData] = useState({
    otp: "",
    totalTime: 30,
    timeAvailable: 30,
  });
  const [otpId, setOtpId] = useState("");
  const [buttonTitle, setButtonTitle] = useState("CONTINUE");
  const [showLoader, setShowLoader] = useState(false);
  const [showOtpContainer, setShowOtpContainer] = useState(false);
  const [showDotLoader, setShowDotLoader] = useState(false);
  const { user, kyc, isLoading, updateKyc } = useUserKycHook();
  const isNri = kyc?.address?.meta_data?.is_nri || false;
  const [communicationType, setCommunicationType] = useState("");
  const [isKycDone, setIsKycDone] = useState();
  const [totalPages, setTotalPages] = useState();
  const [isDlFlow, setIsDlFlow] = useState();

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      const type = !kyc.identification.meta_data.email_verified
        ? "email"
        : "mobile";
      setCommunicationType(type);
      const data = { ...formData };
      data.email = kyc.identification.meta_data.email;
      let mobileNumber = kyc.identification.meta_data.mobile_number || "";
      const [extension, number] = mobileNumber.toString().split("|");
      if (extension) mobileNumber = number;
      data.mobile = mobileNumber;
      data.disableMobile = kyc.identification.meta_data.mobile_number_verified;
      setFormData({ ...data });
      setIsKycDone(kyc?.mf_kyc_processed);
      setIsDlFlow(isDigilockerFlow(kyc));
      setTotalPages(getTotalPagesInPersonalDetails());
      if(showOtpContainer) {
        setShowOtpContainer(false);
      }
    }
  }, [kyc, user]);

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
    setShowDotLoader(true);
    try {
      const result = await resendOtp(otpId);
      setOtpId(result.otp_id);
      setOtpData({
        otp: "",
        totalTime: 30,
        timeAvailable: 30,
      });
    } catch (err) {
      toast(err.message);
    } finally {
      setShowDotLoader(false);
    }
  };

  const handleOtp = (otp) => {
    setOtpData({ ...otpData, otp });
  };

  const handleClick = async () => {
    try {
      if (showOtpContainer) {
        if (otpData.otp.length !== 4) {
          toast("Minimum otp length is 4");
          return;
        }
        setShowLoader("button");
        const otpResult = await verifyOtp({ otpId, otp: otpData.otp });
        updateKyc(otpResult.kyc);
        if (
          otpResult.kyc.identification.meta_data.mobile_number_verified &&
          otpResult.kyc.identification.meta_data.email_verified
        ) {
          handleNavigation();
        }
      } else {
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
          body.mobile = formData.mobile;
          body.whatsapp_consent = formData.whatsappConsent;
        }
        setShowLoader("button");
        const result = await sendOtp(body);
        if (
          communicationType === "mobile" &&
          kyc.identification.meta_data.mobile_number_verified
        ) {
          handleNavigation();
          return;
        }
        setShowOtpContainer(true);
        setOtpId(result.otp_id);
        setOtpData({
          otp: "",
          totalTime: 30,
          timeAvailable: 30,
        });
        setButtonTitle("VERIFY");
      }
    } catch (err) {
      toast(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  const handleEdit = () => {
    if (showDotLoader) return;
    setShowOtpContainer(false);
    setButtonTitle("CONTINUE");
  };

  const handleNavigation = () => {
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

  const pageNumber = isDlFlow ? 3 : 4;
  return (
    <Container
      buttonTitle={buttonTitle}
      title="Communication details"
      count={!isKycDone && pageNumber}
      current={pageNumber}
      total={!isKycDone && totalPages}
      handleClick={handleClick}
      showLoader={showLoader}
      skelton={isLoading}
      disable={showDotLoader}
    >
      <div
        className={`kyc-communication-details ${
          communicationType === "mobile" &&
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
              disabled={showLoader || formData.disableMobile}
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
                inputMode: "numeric",
              }}
            />
          )}
          {!showOtpContainer && (
            <div className="kcd-email-subtext">
              {communicationType === "email"
                ? "We'll keep you updated on your investments"
                : "We’ll send an OTP to verify your mobile number"}
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
    </Container>
  );
};

export default CommunicationDetails;
