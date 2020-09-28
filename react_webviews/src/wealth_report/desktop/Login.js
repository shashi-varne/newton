import React, { Fragment, useState, useEffect } from "react";
import WrButton from "../common/Button";
import WrOtpInput from "../common/OtpInput";
import WrPhoneInput from "../common/PhoneInput";
import { getConfig } from "utils/functions";
import SplashBg from "assets/fisdom/bg_image_hni.png";
import { resendOtp, login, verifyOtp, emailLogin, forgotPassword } from "../common/ApiCalls";
import toast from '../../common/ui/Toast';
import CircularProgress from "@material-ui/core/CircularProgress";
import { navigate } from "../common/commonFunctions";
import LoadingScreen from "../mini-components/LoadingScreen";
import { Button, FormControl, TextField, IconButton } from "material-ui";
import { nativeCallback } from 'utils/native_callback';
import { validateEmail, storageService } from "../../utils/validators";
const isMobileView = getConfig().isMobileDevice;

const Login = (props) => {
  const { params } = props.match;
  const [view, setView] = useState('');
  const [otp, setOtp] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [format, setFormat] = useState('99999-99999');
  const [number, setNumber] = useState('');
  const [opLoading, setOpLoading] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [commonLoginErr, setCommonLoginErr] = useState("");
  const [resendDisabled, disableResend] = useState(false);
  // const serverUrl = 'https://wreport-dot-plutus-staging.appspot.com';
  const serverUrl = 'https://my.fisdom.com';
  const socialRedirectUrl = encodeURIComponent('https://wv.fisdom.com/w-report/main/overview?base_url=https://my.fisdom.com');

  const sendEvents = (user_action, props) => {
    let eventObj = {
      "event_name": 'portfolio web report',
      "properties": {
        "user_action": user_action,
        ...props,
      }
    };
    console.log('Event:', eventObj);
    nativeCallback({ events: eventObj });
  };

  useEffect(() => {
    const storage_val = storageService().get('wr-link-click-time');
    const link_click_time = storage_val ? new Date(storage_val) : null;
    const current_time = new Date();

    // If link is clicked again within 30 mins, will not log/trigger the event
    if (!link_click_time || (current_time - link_click_time)/60000 > 30) {
      storageService().set('wr-link-click-time', current_time);
      sendEvents('link clicked', { screen_name: 'link clicked' });
    }
  }, []);

  useEffect(() => {
    if (params.view) {
      setView(params.view);
    } else if (isMobileView) {
      setView('splash');
    } else {
      setView('phone');
    }
    setEmailErr('');
    setPwdErr('');
    setOtpErr('');
  }, [params.view]);

  const handleOtp = (val) => {
    setOtpErr('');
    setOtp(val);
    if (val.length === 4) verify(val);
  };

  const onKeyDown = (event) => {
    var code = event.keyCode;
    if (code === 13) {
      clickContinue();
    }
  };

  const resend = async() => {
    try {
      if (resendDisabled) return;
      disableResend(true);
      await resendOtp();
      setTimeout(() => disableResend(false), 30000);
      setOtp('');
      toast('OTP resent!');
    } catch(err) {
      console.log(err);
      if (err.toLowerCase().includes('correct otp')) {
        toast('Incorrect OTP! Please check and try again');
      } else {
        toast(err);
      }
    }
  };

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

  const handleInput = (e, type) => {
    if (type === 'email') {
      setEmailErr('');
      setEmail(e.target.value);
    } else if (type === 'password') {
      setPwdErr('');
      setPwd(e.target.value);
    }
    setCommonLoginErr('');
  };

  const triggerOtp = async() => {
    try {
      setOpLoading(true);
      await login({ mobileNo: number, countryCode });
      navigate(props, 'login/otp');
    } catch(err) {
      sendEvents('login', {
        screen_name: 'login',
        status: 'fail',
        error_message: err,
      });
      console.log(err);
      toast(err);
    }
    setOpLoading(false);
  };

  const verify = async(otpVal) => {
    try {
      setOpLoading(true);
      const res = await verifyOtp({ mobileNo: number, countryCode, otp: otpVal });
      sendEvents('login', {
        screen_name: 'login',
        status: 'success',
        user_id: res.user.user_id,
      });
      navigate(props, 'main/overview');
    } catch(err) {
      if (err.includes('wrong OTP')) {
        setOtpErr('Incorrect OTP! Please check and try again');
      } else {
        console.log(err);
        toast(err);
      }
      sendEvents('login', {
        screen_name: 'login',
        status: 'fail',
        error_message: err,
      });
    }
    setOpLoading(false);
  };

  const validatePhone = () => {
    let err = '';
    if (!countryCode) {
      err = "Please select a country code";
    } else if (!number || number.split('-').join('').length !== 10) {
      err = "Please enter a valid number";
    }
    return err;
  };

  const loginWithEmail = async () => {
    try {
      if (!validateEmail(email)) {
        return setEmailErr("Please enter a valid email");
      } else if (!password) {
        return setPwdErr('Please enter password');
      }
      setOpLoading(true);
      const res = await emailLogin({ email, password });
      sendEvents('login', {
        screen_name: 'login',
        status: 'success',
        user_id: res.user.user_id,
      });
      navigate(props, 'main/overview');
    } catch (err) {
      console.log(err);
      if (err.includes('registered')) {
        setEmailErr("This email is not registered!");
      } else if (err.includes('password')) {
        setCommonLoginErr("Incorrect email or password!");
      } else {
        toast(err);
      }
      sendEvents('login', {
        screen_name: 'login',
        status: 'fail',
        error_message: err,
      });
    }
    setOpLoading(false);
  };

  const resetPassword = async () => {
    try {
      if (!validateEmail(email)) {
        return setEmailErr("Please enter a valid email");
      }
      setOpLoading(true);
      await forgotPassword({ email });
      toast(`A link has been sent to ${email}`);
      navigate(props, 'login/email');
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setOpLoading(false);
  };

  const clickContinue = () => {
    if (view === 'splash') {
      navigate(props, 'login/phone');
    } else if (view === 'phone') {
      const err = validatePhone();
      if (err) {
        setPhoneErr(err);
      } else {
        triggerOtp();
      }
    } else if (view === 'otp') {
      verify(otp);
    } else if (view === 'email') {
      loginWithEmail();
    } else if (view === 'forgot-password') {
      resetPassword();
    }
  };

  const renderNumberView = (
    <div className="wr-login-input">
      <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="wr-logo" alt="" />
      <div id="wr-title">Login with Phone Number</div>
      <div className="subtitle">
        Please enter mobile number to view your Portfolio Report
      </div>
      <div id="wr-input-label">Enter phone number</div>
      <WrPhoneInput 
        onCodeChange={handleCodeChange}
        onInputChange={handleNumberChange}
        phone={countryCode}
        format={format}
        number={number}
        onKeyDown={onKeyDown}
        autoFocus={true}
      />
      {/* { */}
        <div style={{
          marginTop: "10px",
          marginBottom: phoneErr ? "20px" : "35px",
          color: "red",
          letterSpacing: "0.5px"
        }}>
          {phoneErr}
        </div>
      {/* } */}
      <WrButton
        fullWidth={true}
        classes={{ root: "wr-login-btn" }}
        onClick={clickContinue}
        disabled={opLoading}>
        {opLoading ?
          <CircularProgress size={20} thickness={4} color="white" /> :
          'Send OTP'
        }
      </WrButton>
      <img src={require('assets/fisdom/ORDivider.svg')} alt="or" style={{ width: '100%', margin: '30px 0' }} />
      <div id="wr-alternate-login-btns">
        <Button
        fullWidth={true}
        classes={{ root: "wr-email-login-btn" }}
        onClick={() => navigate(props, 'login/email')}
        disabled={opLoading}>
          Continue with Email
      </Button>
        <div style={{ display: 'flex', marginTop: '30px' }}>
          <Button
            fullWidth={true}
            classes={{ root: "wr-social-btn" }}
            style={{ marginRight: '20px !important' }}
            href={serverUrl + '/auth/facebook?redirect_url=' + socialRedirectUrl}
            disabled={opLoading}>
            <img src={require('assets/facebook.svg')} alt="fb" style={{ marginRight: '12px' }} />
            Facebook
          </Button>
          <Button
            fullWidth={true}
            classes={{ root: "wr-social-btn" }}
            href={serverUrl + '/auth/google?redirect_url=' + socialRedirectUrl}
            disabled={opLoading}>
            <img src={require('assets/google.svg')} alt="google" style={{ marginRight: '12px' }} />
            Google
          </Button>
      </div>
      </div>
    </div>
  );

  const renderOTPView = (
    <div className="wr-login-input">
      <img src={require("assets/fisdom/ic-mobile-verification.svg")} id="wr-logo" alt="" />
      <div id="wr-title">One Time Password (OTP)</div>
      <div className="subtitle">
        We’ve sent an OTP to your mobile number <br/>+91 {number}
      </div>
      <div>
        <WrOtpInput
          onChange={handleOtp}
          value={otp}
          errorText={otpErr}
          onKeyDown={onKeyDown}
        />
      </div>
      <div id="wr-otp-opts">
        <span
          onClick={resend}
          style={{
            cursor: resendDisabled ? 'not-allowed' : 'pointer',
            color: resendDisabled ? 'rgba(0, 0, 0, 0.5)' : 'var(--primary)'
          }}
          >
          Resend OTP
        </span>
        <span onClick={() => { setOtp(''); navigate(props, 'login/phone') }}>Enter number again?</span>
      </div>
    </div>
  );

  const renderForgotPassword = (
    <div className="wr-login-input">
      <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="wr-logo" alt="" />
      <div id="wr-title">Forgot Password</div>
      <div className="subtitle">
        We will send a link to reset password on your registered email address
      </div>
      <div style={{ marginBottom: '28px' }}>
        <FormControl className="wr-form">
          <TextField
            variant="outlined"
            placeholder="Enter email"
            InputProps={{
              disableUnderline: true,
              // className: "wr-input-addmail",
            }}
            type="email"
            classes={{ root: "wr-input-addmail" }}
            onChange={(e) => handleInput(e, 'email')}
          />
        </FormControl>
        {!!emailErr && <div style={{
            marginTop: "7px",
            color: "red",
            letterSpacing: "0.5px"
          }}>
            {emailErr}
          </div>
        }
      </div>
    </div>
  );

  const renderEmailView = (
    <div className="wr-login-input">
      <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="wr-logo" alt="" />
      <div id="wr-title">Login with Email</div>
      <div className="subtitle">
        Enter email address and password to view your Portfolio Report
      </div>
      <div style={{ marginBottom: '28px' }}>
        <FormControl className="wr-form">
          <TextField
            variant="outlined"
            placeholder="Enter email"
            InputProps={{
              disableUnderline: true,
            }}
            type="email"
            classes={{ root: "wr-input-addmail" }}
            onChange={(e) => handleInput(e, 'email')}
          />
        </FormControl>
        {!!emailErr && <div className="wr-field-err">
            {emailErr}
          </div>
        }
      </div>
      <div style={{ marginBottom: '38px' }}>
        <FormControl className="wr-form">
          <TextField
            variant="outlined"
            placeholder="Enter password"
            autoComplete="new-password"
            InputProps={{
              disableUnderline: true,
            }}
            type="password"
            classes={{ root: "wr-input-addmail" }}
            onKeyDown={onKeyDown}
            onChange={(e) => handleInput(e, 'password')}
          />
        </FormControl>
        {!!pwdErr && <div className="wr-field-err">
          {pwdErr}
        </div>}
      </div>
      {!!commonLoginErr &&
        <div className="wr-field-err" style={{ marginBottom: '40px' }}>
          {commonLoginErr}
        </div>
      }
      <div
        className="wr-forgot-pwd"
        onClick={() => navigate(props, 'login/forgot-password')}>
        Forgot Password?
      </div>
    </div>
  );

  const renderSplashScreen = (
    <Fragment>
      <div id="wr-continue">
        <img
          src={require('assets/fisdom/fisdom_logo.png')}
          alt="fisdom"
        />
        <div id="wr-title">Portfolio Report</div>
        <div id="wr-subtitle">
          See a consolidated view of all your Mutual Fund investments along 
          with a preliminary analysis of your portfolio fundamentals
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
          <div style={{ flexBasis: '48%' }}>
            <img
              src={require("assets/ic-login-abstract.svg")}
              alt="banner"
              id="wr-login-img"
            />
          </div>
          <div style={{ flex: 1, paddingLeft: '7%'  }}>
            <div id="wr-login-right-panel">
              <img
                src={require('assets/fisdom/fisdom_logo_coloured.png')}
                style={{ cursor: 'pointer' }}
                alt="fisdom" width={130}
                onClick={() => navigate(props, 'login')}
              />
              <h2>Welcome to Fisdom!</h2>
              {view === 'phone' && renderNumberView}
              {view === 'otp' && renderOTPView}
              {view === 'email' && renderEmailView}
              {view === 'forgot-password' && renderForgotPassword}
              {view !== 'phone' &&
                <WrButton
                  fullWidth={true}
                  classes={{ root: "wr-login-btn m-t-60" }}
                  disabled={opLoading}
                  onClick={clickContinue}>
                  {opLoading ?
                    <CircularProgress size={20} thickness={4} color="white" /> :
                    'Continue'
                  }
                </WrButton>
              }
            </div>
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
            {!['splash', 'phone'].includes(view) && <IconButton onClick={() => props.history.goBack()}>
              <img
                src={require('assets/ic-mob-back.svg')}
                alt="expand"
                style={{ cursor: 'pointer', marginLeft: '-50%' }} />
            </IconButton>}
            {view === 'splash' && renderSplashScreen}
            {view === 'phone' && renderNumberView}
            {view === 'otp' && renderOTPView}
            {view === 'email' && renderEmailView}
            {view === 'forgot-password' && renderForgotPassword}
            {(view !== 'splash' && view !== 'phone') && <div className="wr-continue-btn">
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
