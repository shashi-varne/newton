import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import HeaderDataContainer from '../common/HeadDataContainer';
import OtpInput from 'react-otp-input';
import { Typography } from '@material-ui/core';
import { navigate } from '../common/commonFunction';
import { storageService } from 'utils/validators';
import { request_order, resend_otp, verify_otp } from '../common/Api';
import toast from 'common/ui/Toast';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const MIN = 0;
const MAX = 10;
const Otp = (props) => {
  const [otp, setOtp] = useState('');
  const [orderRes, setOrderRes] = useState('');
  const [trx, settrx] = useState('');
  const [resend, setResend] = useState('');
  const [counter, setCounter] = useState(10);
  const [mobile, setMobile] = useState(storageService().getObject('mobile') || '');
  const [error, setOtpErr] = useState(null);
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    const request_otp = async () => {
      try {
        const res = await request_order();
        setOrderRes(res);
        settrx(res.trx_key);
        setResend(res.resend_redeem_otp_link);
        const mobile = res.mobile.replace(/^\+\w+\|/i, '');
        setMobile(mobile);
        //setMobile(res.mobile);
        //throw 'something went wrong';
        if (res.message) {
          toast(res.message, 'warn');
        }
        console.log('response from fund is', res);
      } catch (err) {
        toast(err, 'error');
        console.log(err);
      }
      //storageService().setObject('user_mobile', res.message.mobile);
    };
    request_otp();
  }, []);

  useEffect(() => {
    let counter = setInterval(progress, 1000);
    return () => {
      clearInterval(counter);
    };
  }, []);

  const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

  const progress = () => {
    setCounter((counter) => {
      if (counter > 0) {
        return counter - 1;
      } else {
        return 0;
      }
    });
  };
  const nextPage = async () => {
    if (otp.toString().length === 4) {
      const user_id = storageService().getObject('user_id');
      try {
        console.log(trx);
        setOtpErr(null);
        setDisable(true);
        const res = await verify_otp(trx, { user_id, otp });
        console.log('otp res', res);
        navigate(props, 'rebalance-success');
      } catch (err) {
        console.log(err);
        setDisable(false);
        if (err.includes('wrong OTP')) {
          setOtpErr('Incorrect OTP! Please check and try again');
        } else {
          toast(err, 'warn');
        }
        setOtp('');
      }
    }
  };
  const handleChange = (otp) => {
    setOtp(otp);
  };
  const resendOtp = async (e) => {
    setOtpErr(null);
    try {
      const res = await resend_otp(resend);
      setCounter(10);
      setOrderRes(res);
      setResend(res.resend_redeem_otp_link);
      const mobile = res.mobile.replace(/^\+\w+\|/i, '');
      setMobile(mobile);
      if (res.message) {
        toast(res.message, 'success');
      }
      console.log('response from fund is', res);
    } catch (err) {
      toast(err, 'error');
    }
  };

  return (
    <Container
      buttonTitle='Continue'
      handleClick={nextPage}
      disable={otp.toString().length !== 4 || disable}
    >
      <HeaderDataContainer title='Enter OTP to verify'>
        <section className='otp-successful-section'>
          <Typography className='otp-success-msg'>
            An OTP has been sent to your registered phone number {mobile.length > 0 && mobile} .
            Please Input OTP to proceed with your transaction.
          </Typography>
        </section>
        <section className='otp-data'>
          <OtpInput
            containerStyle='otp-container'
            inputStyle='otp-input'
            isInputNum
            value={otp}
            onChange={handleChange}
            numInputs={4}
            shouldAutoFocus
            hasErrored={error}
            isDisabled={disable}
          />
          {error && <div className='otp-error'>{error}</div>}
          <div align='center' className='otp-resend-text'>
            {counter === 0 ? (
              <div>
                Didn’t receive?{' '}
                <span
                  className={`resend-link ${counter > 0 && 'disable_resend_link'}`}
                  onClick={resendOtp}
                >
                  Resend OTP
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress variant='static' size={30} value={normalise(counter)} />
                <span className='counter-value'>{`00:${counter}`}</span>
              </div>
            )}
          </div>
        </section>
      </HeaderDataContainer>
    </Container>
  );
};

export default Otp;
