import React, { Fragment, useState } from "react";
import WrButton from "../common/Button";
import WrOtpInput from "../common/OtpInput";
import WrPhoneInput from "../common/PhoneInput";
import { getConfig } from "utils/functions";
import SplashBg from "assets/fisdom/bg_image_hni.png";
import { resendOtp, login, verifyOtp } from "../common/ApiCalls";
import toast from '../../common/ui/Toast';
import CircularProgress from "@material-ui/core/CircularProgress";
import { navigate } from "../common/commonFunctions";
import SVG from 'react-inlinesvg';
import LoadingScreen from "../mini-components/LoadingScreen";
const isMobileView = getConfig().isMobileDevice;

const Login = (props) => {
  const [otp, setOtp] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [format, setFormat] = useState('99999-99999');
  const [number, setNumber] = useState('');
  const [view, setView] = useState(isMobileView ? 'splash' : 'phone');
  const [opLoading, setOpLoading] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');

  const handleOtp = (val) => {
    setOtpErr('');
    setOtp(val);
  };

  const resend = async() => {
    try {
      await resendOtp();
    } catch(err) {
      console.log(err);
      toast(err);
    }
  };

  const renderOTPView = () => {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-mobile-verification.svg")} id="wr-logo" alt="" />
        <div id="wr-title">One Time Password (OTP)</div>
        <div className="subtitle">
          Enter the OTP which has been sent on your mobile phone
        </div>
        <div>
          <WrOtpInput
            onChange={handleOtp}
            value={otp}
            errorText={otpErr}
          />
        </div>
        <div id="wr-otp-opts">
          <span onClick={resend}>Resend OTP</span>
          <span onClick={() => setView('phone')}>Enter number again?</span>
        </div>
      </div>
    );
  }

  const handleCodeChange = (event) => {
    let value = event.target.value.split("/");
    let code = value[0];
    let format =
      code.length <= 2
        ? value[1].slice(code.length + 1) + "99"
        : "9999 9999 9999";

    setCountryCode(event.target.value);
    setFormat(format.split(".").join("9"));
    setPhoneErr('');
  };

  const handleNumberChange = (event) => {
    setPhoneErr('');
    setNumber(event.target.value);
  };

  const triggerOtp = async() => {
    try {
      setOpLoading(true);
      await login({ mobileNo: number, countryCode });
      setView('otp');
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setOpLoading(false);
  }

  const verify = async() => {
    try {
      setOpLoading(true);
      await verifyOtp({ mobileNo: number, countryCode, otp });
      setView('loading');
      setTimeout(()=>{
        navigate(props, 'main/overview');
      }, 3000);
      // navigate to homepage
    } catch(err) {
      if (err.includes('wrong OTP')) {
        setOtpErr('Incorrect OTP');
      } else {
        console.log(err);
        toast(err);
      }
    }
    setOpLoading(false);
  }

  const validatePhone = () => {
    let err = '';
    if (!countryCode) {
      err = "Please select a country code";
    } else if (!number || number.split('-').join('').length !== 10) {
      err = "Please enter a valid number";
    }
    return err;
  }

  const clickContinue = () => {
    if (view === 'splash') {
      setView('phone');
    } else if (view === 'phone') {
      const err = validatePhone();
      if (err) {
        setPhoneErr(err);
      } else {
        triggerOtp();
      }
    } else if (view === 'otp') {
      verify();
    }
  }


  const renderNumberView = () => {
    return (
      <div className="wr-login-input">
        <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="wr-logo" alt="" />
        <div id="wr-title">Login with Phone Number</div>
        <div className="subtitle">
          Please enter your 10 digit mobile number to access your wealth report
        </div>
        <div id="wr-input">Enter phone number</div>
        <WrPhoneInput 
          onCodeChange={handleCodeChange}
          onInputChange={handleNumberChange}
          phone={countryCode}
          format={format}
          number={number}
        />
        {phoneErr &&
          <div style={{
            marginTop: "10px",
            color: "red",
            letterSpacing: "0.5px"
          }}>
            {phoneErr}
          </div>
        }
      </div>
    );
  }

  const renderSplashScreen = () => (
    <Fragment>
      <div id="wr-continue">
        <img
          src={require('assets/fisdom/fisdom_logo.png')}
          alt="fisdom"
        />
        <div id="wr-title">Wealth Report</div>
        <div id="wr-subtitle">
          Now investing money made more easy and safe. We at fisdom monitor your
          money closely at all times to ensure it is always making the most for
          you.
        </div>
      </div>
      <div className="wr-continue-btn">
        <WrButton
          fullWidth={true}
          style={{
            backgroundColor: view === 'splash' ? 'white' : 'var(--primary)',
            color: view === 'splash' ? 'var(--primary)' : 'white'
          }}
          classes={{ root: "wr-splash-btn" }}
          onClick={clickContinue}>
          Login to Continue
        </WrButton>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      {!isMobileView && view !== 'loading' &&
        <div id="wr-login">
          <img
            src={require("assets/ic-login-abstract.svg")}
            alt="banner"
            id="wr-login-img"
          />
          <div id="wr-login-right-panel">
            <img src={require('assets/fisdom/fisdom_logo.png')} alt="fisdom" />
            <h2>Welcome to Fisdom!</h2>
            {view === 'phone' && renderNumberView()}
            {view === 'otp' && renderOTPView()}
            <WrButton
              fullWidth={true}
              classes={{ root: "wr-login-btn" }}
              onClick={clickContinue}>
              {opLoading ?
                <CircularProgress size={20} thickness={4} color="white" /> :
                'Continue'
              }
            </WrButton>
          </div>
        </div>
      }
      {isMobileView && view !== 'loading' &&
        <div
          id="wr-login-mobile"
          style={{
            backgroundImage: view === 'splash' ? `url(${SplashBg})` : '',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div id="wr-mobile-view">
            {view === 'splash' && renderSplashScreen()}
            {view === 'phone' && renderNumberView()}
            {view === 'otp' && renderOTPView()}
            {view !== 'splash' && <div className="wr-continue-btn">
                <WrButton
                  fullWidth={true}
                  classes={{ root: "wr-login-btn" }}
                  onClick={clickContinue}
                  disabled={opLoading}>
                  {opLoading ?
                    <CircularProgress size={20} thickness={4} color="white" /> :
                    'Continue'
                  }
                </WrButton>
              </div>
            }
          </div>
        </div>
      }
      {view === 'loading' &&
        <LoadingScreen text="Preparing your report, please wait..." />
      }
    </Fragment>
  );
}

export default Login;
