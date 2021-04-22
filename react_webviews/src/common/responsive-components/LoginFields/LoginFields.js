import React, { Fragment, useState, useEffect, cloneElement } from "react";
import {
  resendOtp,
  login,
  verifyOtp,
  emailLogin,
  forgotPassword,
} from "./login_apis";
import toast from '../../ui/Toast';
import CircularProgress from "@material-ui/core/CircularProgress";
import LoadingScreen from "../../../wealth_report/mini-components/LoadingScreen";
import { FormControl, TextField, InputAdornment } from "material-ui";
import { validateEmail, storageService, isFunction } from "../../../utils/validators";

const LoginFields = (props) => {
  const { navigateFunction: navigate, parentProps } = props;
  const storedEmail = storageService().get('common-login-email');
  const storedPwd = storageService().get('common-login-password');
  const { params = {} } = parentProps.match || {};
  const [view, setView] = useState('');
  const [otp, setOtp] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [number, setNumber] = useState('');
  const [opLoading, setOpLoading] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [email, setEmail] = useState(storedEmail || "");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPwd] = useState(storedPwd || "");
  const [showPassword, setShowPassword] = useState(false);
  const [resendDisabled, disableResend] = useState(false);

  useEffect(() => {
    if (params.view) {
      setView(params.view);
      if (params.view === 'phone') {
        storageService().set('common-login-email', '');
        setEmail('');
        storageService().set('common-login-password', '');
        setPwd('');
      }
    } else {
      setView('phone');
    }
    setEmailErr('');
    setOtpErr('');
  }, [params.view]);

  const goBack = () => {
    storageService().set('common-login-email', '');
    setEmail('');
    storageService().set('common-login-password', '');
    setPwd('');
    navigate('login/phone');
  };

  const forgotPasswordClicked = () => {
    console.log('ere', props);
    const { onForgotPasswordClicked } = props;
    if (onForgotPasswordClicked && isFunction(onForgotPasswordClicked)) {
      onForgotPasswordClicked();
    } else {
      navigate('login/forgot-password');
    }
  };

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

  const resend = async () => {
    try {
      if (resendDisabled) return;
      disableResend(true);
      await resendOtp();
      setTimeout(() => disableResend(false), 30000);
      setOtp('');
      toast('OTP resent!');
    } catch (err) {
      console.log(err);
      if (err.toLowerCase().includes('correct otp')) {
        toast('Incorrect OTP! Please check and try again');
      } else {
        toast(err);
      }
    }
  };

  const handleNumberChange = (value, { dialCode }) => {
    setPhoneErr('');
    setNumber(value);
    setCountryCode(dialCode);
  };

  const handleInput = (e, type) => {
    setEmailErr('');
    if (type === 'email') {
      setEmail(e.target.value);
    } else if (type === 'password') {
      setPwd(e.target.value);
    }
  };

  const formatNumber = () => {
    if (number.length > 10 && number.slice(0, 2)) {
      return number.slice(2);
    }
    return number;
  };

  const triggerOtp = async () => {
    try {
      const err = validatePhone();
      console.log(err);
      if (err) {
        return setPhoneErr(err);
      }
      setOpLoading(true);
      await login({ mobileNo: formatNumber(), countryCode });
      navigate('login/otp');
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setOpLoading(false);
  };

  const verify = async (otpVal) => {
    try {
      setOpLoading(true);
      const res = await verifyOtp({ mobileNo: formatNumber(), countryCode, otp: otpVal });
      props.onLoginSuccess(res);
    } catch (err) {
      if (err.includes('wrong OTP')) {
        setOtpErr('Incorrect OTP! Please check and try again');
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
    } else if (!number || number.length !== 12) {
      err = "Please enter a valid number";
    }
    return err;
  };

  const loginWithEmail = async () => {
    try {
      if (!validateEmail(email)) {
        return setEmailErr("Please enter a valid email");
      } else if (!password) {
        return setEmailErr('Please enter password');
      }
      setOpLoading(true);
      const res = await emailLogin({ email, password });
      props.onLoginSuccess(res);
    } catch (err) {
      console.log(err);
      if (err.includes('registered')) {
        setEmailErr("This email is not registered!");
      } else if (err.includes('password')) {
        setEmailErr("Incorrect email or password!");
      } else {
        toast(err);
      }
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
      navigate('login/email');
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setOpLoading(false);
  };

  const clickContinue = () => {
    if (view === 'splash') {
      navigate('login/phone');
    } else if (view === 'phone') {
      triggerOtp();
    } else if (view === 'otp') {
      verify(otp);
    } else if (view === 'email') {
      loginWithEmail();
    } else if (view === 'forgot-password') {
      resetPassword();
    }
  };

  const renderNumberView = (
    <div className="common-login-input">
      <div className="cli-header">Login with mobile number</div>
      {cloneElement(props.phoneComponent, {
        value: number,
        onChange: handleNumberChange,
        onKeyDown: onKeyDown,
      })}
      {cloneElement(props.buttonComponent, {
        onClick: () => clickContinue(),
        disabled: opLoading,
        fullWidth: true,
        style: { marginTop: '20px' },
        children: opLoading ?
          <CircularProgress size={20} thickness={4} color="primary" /> :
          'Login',
      })}
      <CommonLoginOpts navigate={navigate} parentProps={parentProps} view={view}/>
    </div>
  );

  const renderOTPView = (
    <div className="common-login-input">
      <div className="cli-header">Verify with OTP</div>
      <div id="cli-otp-subheader">
        Sent to +{countryCode}-{number.slice(2)}
        <span onClick={() => navigate('login/phone')}>Change</span>
      </div>
      <div style={{ width: '100%' }}>
        {cloneElement(props.otpComponent, {
          value: otp,
          errorText: otpErr,
          onChange: handleOtp,
          onKeyDown: onKeyDown,
        })}
      </div>
      {cloneElement(props.buttonComponent, {
        onClick: () => clickContinue(),
        disabled: opLoading,
        fullWidth: true,
        style: { marginTop: '20px' },
        children: opLoading ?
          <CircularProgress size={20} thickness={4} color="white" /> :
          'Continue',
      })}
      <div id="cli-otp-resend">
        Not received your code?
        &nbsp;
        <span
          onClick={resend}
          style={{
            cursor: resendDisabled ? 'not-allowed' : 'pointer',
            opacity: resendDisabled ? '0.5' : '1'
          }}
        >Resend OTP</span>
      </div>
      <div id="cli-otp-back" onClick={goBack}>
        Back to login
      </div>
    </div>
  );

  const renderForgotPassword = (
    <div className="common-login-input">
      <img src={require("assets/fisdom/ic-fisdom-logo.jpg")} id="common-logo" alt="" />
      <h2>Forgot Password</h2>
      <div className="subtitle">
        We will send a link to reset password on your registered email address
      </div>
      <div>
        <FormControl className="common-form">
          <TextField
            variant="outlined"
            placeholder="Enter email"
            InputProps={{
              disableUnderline: true,
              // className: "common-input-addmail",
            }}
            type="email"
            classes={{ root: "common-input-addmail" }}
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
    <div className="common-login-input">
      <div className="cli-header">
        Login with email
      </div>
      <FormControl className="cli-email-form-1">
        <TextField
          variant="outlined"
          placeholder="Enter email"
          InputProps={{
            disableUnderline: true,
            classes: props.emailFieldClasses,
          }}
          value={email}
          type="email"
          autoFocus
          classes={props.emailFieldClasses || {}}
          onChange={(e) => handleInput(e, 'email')}
        />
      </FormControl>
      <FormControl className="cli-email-form-2">
        <TextField
          variant="outlined"
          placeholder="Enter password"
          autoComplete="new-password"
          InputProps={{
            disableUnderline: true,
            classes: props.emailFieldClasses,
            endAdornment:
              <InputAdornment position="end" style={{ margin: '14px 18px'}}>
                {/* <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePwdVisibility}
                  // onMouseDown={togglePwdVisibility}
                > */}
                <span id="cli-pwd-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</span>
                {/* </IconButton> */}
              </InputAdornment>
          }}
          type={showPassword ? 'text' : 'password'}
          value={password}
          classes={props.emailFieldClasses || {}}
          onKeyDown={onKeyDown}
          onChange={(e) => handleInput(e, 'password')}
        />
      </FormControl>
      {cloneElement(props.buttonComponent, {
        onClick: () => clickContinue(),
        disabled: opLoading,
        fullWidth: true,
        style: { marginTop: '20px' },
        children: opLoading ?
          <CircularProgress size={20} thickness={4} color="white" /> :
          'Login',
      })}
      <div
        className="cli-forgot-pwd"
        onClick={forgotPasswordClicked}>
        Forgot Password?
      </div>
      <CommonLoginOpts view={view} navigate={navigate} parentProps={parentProps} />
    </div>
  );

  const renderError = () => {
    let errText = '';
    if (view === 'email' && emailErr) {
      errText = emailErr;
    } else if (view === 'phone' && phoneErr) {
      errText = phoneErr;
    } else if (view === 'otp' && otpErr) {
      errText = otpErr;
    }

    return (errText ? 
      <div className="common-login-err">
        {errText}
      </div> :
      ''
    );
  };

  return (
    <Fragment>
      {view !== 'loading' &&
        <div id="common-login">
          {renderError()}
          {view === 'phone' && renderNumberView}
          {view === 'otp' && renderOTPView}
          {view === 'email' && renderEmailView}
          {view === 'forgot-password' && renderForgotPassword}
        </div>
      }
      {view === 'loading' &&
        <LoadingScreen text="Preparing your report, please wait..." />
      }
    </Fragment>
  );
}

const CommonLoginOpts = (props) => {
  const serverUrl = 'https://my.fisdom.com';
  const socialRedirectUrl = encodeURIComponent('https://wv.fisdom.com/iw-dashboard/main/dashboard');
  const goTo = props.view === 'phone' ? 'email' : 'phone';
  return (
    <div className="common-login-opts">
      <span id="or-opt">or login with</span>
      <a onClick={() => props.navigate(`login/${goTo}`)}>{goTo === 'phone' ? 'mobile' : goTo}</a>
      <a href={serverUrl + '/auth/facebook?redirect_url=' + socialRedirectUrl}>Facebook</a>
      <a href={serverUrl + '/auth/google?redirect_url=' + socialRedirectUrl}>Google</a>
    </div>
  );
}

export default LoginFields;
