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

  useEffect(() => {
    if (params.view) {
      setView(params.view);
    } else if (isMobileView) {
      setView('splash');
    } else {
      setView('phone');
    }
  }, [params.view]);

  const handleOtp = (val) => {
    setOtpErr('');
    setOtp(val);
  };

  const onKeyDown = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
        //Do stuff in here
    }
  };

  const resend = async() => {
    try {
      await resendOtp();
    } catch(err) {
      console.log(err);
      toast(err);
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
      setPwd(e.target.value);
    }
  };

  const triggerOtp = async() => {
    try {
      setOpLoading(true);
      await login({ mobileNo: number, countryCode });
      navigate(props, 'login/otp');
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setOpLoading(false);
  };

  const verify = async() => {
    try {
      setOpLoading(true);
      await verifyOtp({ mobileNo: number, countryCode, otp });
      storageService().set('wr-username', number);
      navigate(props, 'main/overview');
    } catch(err) {
      if (err.includes('wrong OTP')) {
        setOtpErr('Incorrect OTP');
      } else {
        console.log(err);
        toast(err);
      }
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
      }
      setOpLoading(true);
      await emailLogin({ email, password });
      storageService().set('wr-username', email);
      navigate(props, 'main/overview');
    } catch (err) {
      console.log(err);
      toast(err);
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
      verify();
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
        Please enter your 10 digit registered mobile number to access the wealth report
      </div>
      <div id="wr-input-label">Enter phone number</div>
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
      <WrButton
        fullWidth={true}
        classes={{ root: "wr-login-btn" }}
        onClick={clickContinue}
        onKeyDown={onKeyDown}
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
          onClick={clickContinue}
          disabled={opLoading}>
          <img src={require('assets/facebook.svg')} alt="fb" style={{ marginRight: '12px' }} />
          Facebook
        </Button>
        <Button
          fullWidth={true}
          classes={{ root: "wr-social-btn" }}
          onClick={clickContinue}
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
        <span onClick={() => { setOtp(''); navigate(props, 'login/phone') }}>Enter number again?</span>
      </div>
    </div>
  );

  const renderForgotPassword = (
    <div className="wr-login-input">
      <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="wr-logo" alt="" />
      <div id="wr-title">Forgot Password</div>
      <div className="subtitle">
        We will send a link to reset the password on your registered email address
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
        Enter the email address and password to login to your wealth report
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
      <FormControl className="wr-form" style={{ marginBottom: '38px' }}>
        <TextField
          variant="outlined"
          placeholder="Enter password"
          autoComplete="new-password"
          InputProps={{
            disableUnderline: true,
            // className: "wr-input-addmail",
          }}
          type="password"
          classes={{ root: "wr-input-addmail" }}
          onChange={(e) => handleInput(e, 'password')}
        />
      </FormControl>
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
        <div id="wr-title">Wealth Report</div>
        <div id="wr-subtitle">
          Now investing money made more easy and safe. 
          We at fisdom monitor your money closely at all times to ensure it 
          is always making the most for you.
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
          onKeyDown={onKeyDown}
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
            <img src={require('assets/fisdom/fisdom_logo_coloured.png')} alt="fisdom" width={130}/>
            <h2>Welcome to Fisdom!</h2>
            {view === 'phone' && renderNumberView}
            {view === 'otp' && renderOTPView}
            {view === 'email' && renderEmailView}
            {view === 'forgot-password' && renderForgotPassword}
            {view !== 'phone' && 
              <WrButton
                fullWidth={true}
                classes={{ root: "wr-login-btn" }}
                onKeyDown={onKeyDown}
                onClick={clickContinue}>
                {opLoading ?
                  <CircularProgress size={20} thickness={4} color="white" /> :
                  'Continue'
                }
              </WrButton>
            }
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
                  onKeyDown={onKeyDown}
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
