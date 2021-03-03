import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import Typography from '@material-ui/core/Typography';
import { navigate } from '../common/commonFunction';
import { storageService } from 'utils/validators';
import { request_order, resend_otp, verify_otp, expire_rebalance_switch } from '../common/Api';
import toast from 'common/ui/Toast';
import OtpDefault from '../../common/ui/otp';
import { nativeCallback } from 'utils/native_callback';
const totalTime = 30;
const Otp = (props) => {
  const [otp, setOtp] = useState('');
  const [trx, settrx] = useState('');
  const [resend, setResend] = useState('');
  const [timeAvailable, setTimeAvailable] = useState(30);
  const [mobile, setMobile] = useState(storageService().getObject('mobile') || '');
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const request_otp = async () => {
      try {
        const res = await request_order();
        settrx(res.trx_key);
        setResend(res.resend_redeem_otp_link);
        const mobile_num = res.mobile.replace(/^\+\w+\|/i, '');
        if (Object.keys(storageService().getObject('mobile')).length === 0) {
          storageService().setObject('mobile', mobile_num);
          setMobile(mobile_num);
        } else {
          setMobile(storageService().getObject('mobile'));
        }
        if (res.message) {
          toast(res.message);
        }
      } catch (err) {
        setError(true);
        toast(err);
      }
    };
    request_otp();
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'otp screen',
      },
    };
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const verifyOtp = async (trx, params) => {
    try {
      setDisable(true);
      setError(false);
      await verify_otp(trx, params);
      await expire_rebalance_switch();
      sendEvents('next');
      navigate(props, 'rebalance-success');
    } catch (err) {
      setDisable(false);
      if (err?.includes('wrong OTP')) {
        toast('Incorrect OTP! Please check and try again', 'error');
      } else if (err?.includes('switch order has expired')) {
        toast(`${err} Please try again.`);
      } else {
        toast(err);
      }
      setOtp('');
    }
  };
  const nextPage = () => {
    if (otp.toString().length === 4) {
      if (!disable) {
        verifyOtp(trx, { otp });
      }
    } else {
      if (!otp) {
        toast('please enter the OTP', 'error');
      } else {
        toast('OTP is a 4 digit number', 'error');
      }
    }
  };
  const handleChange = (otp_num) => {
    setOtp(otp_num);
  };
  const resendOtp = async (e) => {
    try {
      setTimeAvailable(totalTime);
      const res = await resend_otp(resend);
      setResend(res.resend_redeem_otp_link);
      if (!mobile) {
        const mobile_new = res.mobile.replace(/^\+\w+\|/i, '');
        setMobile(mobile_new);
        storageService().setObject('mobile', mobile_new);
      }
      if (res.message) {
        toast(res.message);
      }
    } catch (err) {
      setError(true);
      if (err?.includes('switch order has expired')) {
        toast(`${err} Please try again.`);
      } else {
        toast(err);
      }
    }
  };

  const parent = {
    state: {
      timeAvailable,
      totalTime,
      otp,
    },
    handleOtp: handleChange,
    resendOtp,
    class: 'otp-resend-text',
  };

  return (
    <Container
      buttonTitle='Proceed'
      handleClick={nextPage}
      disable={disable}
      events={sendEvents('just_set_events')}
      title='Enter OTP to verify'
      classOverRideContainer='pr-container'
    >
      <div className='pr-otp-container'>
        <section className='otp-successful-section'>
          <Typography className='otp-success-msg'>
            An OTP has been sent to your registered phone number {mobile.length > 0 && mobile}.
            Please Input OTP to proceed with your transaction.
          </Typography>
        </section>
        <OtpDefault parent={parent} isDisabled={disable} isError={error} />
      </div>
    </Container>
  );
};

export default Otp;
