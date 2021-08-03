import React, { useState } from 'react';
import toast from '../../common/ui/Toast';
import { Button, CircularProgress, FormControl, TextField } from 'material-ui';
import { validateEmail } from '../../utils/validators';
import { forgotPassword } from '../../common/responsive-components/LoginFields/login_apis';
// ---------- Image Imports ------------
import fisdomIcon from 'assets/fisdom/fisdom_logo_icon.svg';
import close from 'assets/ic_close.svg';
// -------------------------------------

const ForgotPasswordPage = ({ onClose }) => {
  window.scrollTo(0, 0);

  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e, type) => {
    setEmailErr('');
    setEmail(e.target.value);
  };

  const onKeyDown = (event) => {
    var code = event.keyCode;
    if (code === 13) {
      resetPassword();
    }
  };

  const resetPassword = async () => {
    if (emailSent) {
      return onClose();
    }

    try {
      if (!validateEmail(email)) {
        return setEmailErr("Please enter a valid email");
      }
      setLoading(true);
      await forgotPassword({ email });
      setEmailSent(true);
      toast(`A link has been sent to ${email}`);
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setLoading(false);
  };

  return (
    <div id="iwd-fgt-pwd" className="animatedFade">
      <img src={fisdomIcon} alt="fisdom" width="40" id="iwd-fp-logo" />
      <img src={close} alt="close" id="iwd-fp-close" onClick={onClose} />
      <div id="iwd-fp-content">
        <div id="iwd-fpc-header">Forgot your password?</div>
        <div id="iwd-fpc-subtext">
          {emailSent ?
            <>We’ve sent a reset password link to <b>{email}</b></> :
            "It’s alright! We’ll send a reset password link to your email"
          }
        </div>
        {!emailSent && <FormControl style={{ marginBottom: '20px' }}>
          <TextField
            variant="outlined"
            placeholder="Enter email"
            InputProps={{
              disableUnderline: true,
              classes: {
                root: 'iwd-text-field',
                input: 'iwd-text-field-input',
              },
            }}
            value={email}
            type="email"
            classes={{
              root: 'iwd-text-field',
              input: 'iwd-text-field-input',
            }}
            onChange={(e) => handleInput(e, 'email')}
            onKeyDown={onKeyDown}
          />
          {emailErr && <span id="iwd-fpc-err">{emailErr}</span>}
        </FormControl>}
        <Button
          classes={{
            root: 'iwd-fp-btn',
            label: 'iwd-fp-btn-text',
          }}
          onClick={resetPassword}
          fullWidth={true}>
          {loading ?
            <CircularProgress size={30} thickness={4} color="white" /> :
            emailSent ? 'Okay' : 'Send Link'
          }
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;