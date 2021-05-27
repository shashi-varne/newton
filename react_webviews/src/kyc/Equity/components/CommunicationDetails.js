import InputAdornment from "@material-ui/core/InputAdornment";
import React, { useEffect, useState } from "react";
import Button from "../../../common/ui/Button";
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
import { apiConstants, getPathname } from "../../constants";
import { getBasePath, getConfig } from "../../../utils/functions";
import Otp from "../mini-components/Otp";
import {
  getTotalPagesInPersonalDetails,
  navigate as navigateFunc,
} from "../../common/functions";

const config = getConfig();
const googleButtonTitle = (
  <a
    className="kcd-google-text"
    href={`${config.base_url}${
      apiConstants.socialAuth
    }/google?redirect_url=${encodeURIComponent(
      `${getBasePath()}/kyc/communication-details/callback${
        config.searchParams
      }`
    )}`}
  >
    <img src={require(`assets/google.svg`)} alt="google" />
    <div>Continue with Google</div>
  </a>
);
const CommunicationDetails = (props) => {
  const navigate = navigateFunc.bind(props);
  const stateParams = props.location?.state || {};
  const isEdit = stateParams.isEdit || false;
  const userType = stateParams.userType || "";
  const flowType = stateParams.flowType || "";
  const [formData, setFormData] = useState({
    whatsappConsent: true,
  });
  const [state, setState] = useState({
    otp: "",
    totalTime: 30,
    timeAvailable: 30,
  });
  const [otpId, setOtpId] = useState("");
  const [buttonTitle, setButtonTitle] = useState("CONTINUE");
  const [showLoader, setShowLoader] = useState(false);
  const [showOtpContainer, setShowOtpContainer] = useState(false);
  const [showDotLoader, setShowDotLoader] = useState(false);
  const { user, kyc, isLoading, setKycToSession } = useUserKycHook();
  const isNri = kyc.address?.meta_data?.is_nri || false;
  const [communicationType, setCommunicationType] = useState("");
  useEffect(() => {
    if (!isEmpty(user)) {
      const type = user.mobile === null ? "mobile" : "email";
      setCommunicationType(type);
    }
  }, [user]);

  useEffect(() => {
    if (!isEmpty(kyc)) {
      const data = { ...formData };
      data.email = kyc.identification.meta_data.email;
      let mobile_number = kyc.identification.meta_data.mobile_number || "";
      if (mobile_number && !isNaN(mobile_number.toString().split("|")[1])) {
        mobile_number = mobile_number.split("|")[1];
      }
      data.mobile = mobile_number;
      setFormData({ ...data });
    }
  }, [kyc]);

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
      if (!result) return;
      setOtpId(result.otp_id);
      setState({
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
    setState((state) => {
      return {
        ...state,
        otp,
      };
    });
  };

  const handleClick = async () => {
    try {
      if (showOtpContainer) {
        if (state.otp.length !== 4) {
          toast("Minimum otp length is 4");
          return;
        }
        setShowLoader("button");
        const otpResult = await verifyOtp({ otpId, otp: state.otp });
        if (!otpResult) return;
        setKycToSession(otpResult.kyc);
        handleNavigation();
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
        if (!result) return;
        setShowOtpContainer(true);
        setOtpId(result.otp_id);
        setState({
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
    const data = {
      state: {
        isEdit,
        userType,
      },
    };
    if (userType === "compliant") {
      if (isNri) {
        navigate(getPathname.nriAddressDetails2, data);
      } else {
        navigate(getPathname.compliantPersonalDetails4, data);
      }
    } else {
      if (flowType === "digilocker") {
        navigate(getPathname.digilockerPersonalDetails3, data);
      } else {
        navigate(getPathname.personalDetails4, data);
      }
    }
  };

  const pageNumber = flowType === "digilocker" ? 3 : 4;
  return (
    <Container
      buttonTitle={buttonTitle}
      title="Communication details"
      count={pageNumber}
      current={pageNumber}
      total={getTotalPagesInPersonalDetails(kyc, user)}
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
              <Button
                classes={{ button: "kcd-google-button" }}
                buttonTitle={googleButtonTitle}
                type="outlined"
              />
              <div className="kcd-or-divider">
                <div className="kcd-divider-line"></div>
                <div className="kcd-divider-text">OR</div>
                <div className="kcd-divider-line"></div>
              </div>
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
              inputMode="numeric"
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
          )}
          <div className="kcd-email-subtext">
            We'll keep you updated on your investments
          </div>
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
                  state={state}
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
