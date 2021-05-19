import InputAdornment from "@material-ui/core/InputAdornment";
import React, { useState } from "react";
import Button from "../../../common/ui/Button";
import Input from "../../../common/ui/Input";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import TextField from "@material-ui/core/TextField";
import OtpDefault from "../../../common/ui/otp";
import "./commonStyles.scss";
import { resendOtp, sendOtp } from "../../common/api";
import toast from "../../../common/ui/Toast";
import { validateEmail } from "../../../utils/validators";
import { verifyOtp } from "../../../wealth_report/common/ApiCalls";

const productName = getConfig().productName;
const googleButtonTitle = (
  <div className="kcd-google-text">
    <img src={require(`assets/google.svg`)} />
    <div>Continue with Google</div>
  </div>
);
const CommunicationDetails = (props) => {
  const [formData, setFormData] = useState({});
  const [state, setState] = useState({
    otp: "",
    totalTime: 30,
    timeAvailable: 30,
  });
  const [otpId, setOtpId] = useState("");
  const [buttonTitle, setButtonTitle] = useState("CONTINUE");
  const [showLoader, setShowLoader] = useState(false);
  const [showOtpContainer, setShowOtpContainer] = useState(false);

  const handleChange = (name) => (event) => {
    if (name === "email" && showOtpContainer) {
      return;
    }
    const value = event.target ? event.target.value : event;
    let data = { ...formData };
    data[name] = value;
    data[`${name}_error`] = "";
    setFormData({ ...data });
  };

  const resendOtpVerification = async () => {
    setShowLoader("button");
    try {
      const result = await resendOtpVerification(otpId);
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
      setShowLoader(false);
      setShowOtpContainer(true);
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
        const otpResult = await verifyOtp({ otpId, otp: state.otp });
        if (!otpResult) return;
        toast("succussful");
      } else {
        if (!validateEmail(formData.email)) {
          toast("Please enter valid email");
          return;
        }
        setShowLoader("button");
        const result = await sendOtp({ email: formData.email });
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
    setShowOtpContainer(false);
    setButtonTitle("CONTINUE");
  };

  return (
    <Container
      buttonTitle={buttonTitle}
      title="Communication details"
      count="3"
      current="3"
      total="5"
      handleClick={handleClick}
      showLoader={showLoader}
    >
      <div className="kyc-communication-details">
        <div className="kyc-main-subtitle">
          Email verification is mandatory for investment as per SEBI
        </div>
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
        <div className="kcd-email-subtext">
          We'll keep you updated on your investments
        </div>
        {showOtpContainer && (
          <div className="kcd-otp-container">
            <div className="kcd-email-subtext">
              Enter OTP sent to above email address
            </div>
            <div className="kcd-otp-content">
              <OtpDefault
                parent={{ state, handleOtp, resendOtp: resendOtpVerification }}
                class1="center"
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CommunicationDetails;
