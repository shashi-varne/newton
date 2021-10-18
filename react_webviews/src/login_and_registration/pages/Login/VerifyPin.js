import './commonStyles.scss';
import React, { useEffect, useState } from 'react';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from '../../../utils/validators';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import { verifyPin } from '../../../2fa/common/apiCalls';
import { nativeCallback } from "../../../utils/native_callback";
import WVButton from '../../../common/ui/Button/WVButton';
import DotDotLoader from '../../../common/ui/DotDotLoaderNew';
import { redirectToLaunchDiet, postLoginSetup, redirectAfterLogin } from '../../functions';

const pinAttemptsKey = 'pin-attempts'; // key name for session store

const VerifyPin = (props) => {
  const config = getConfig();
  const productName = config.productName;
  const { name } = storageService().getObject('user') || {};
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(
    Number(storageService().get(pinAttemptsKey)) || 0
  );

  const navigate = navigateFunc.bind(props);

  const onOtpChange = (val) => {
    setMpin(val);
    setMpinError('');
  }

  useEffect(() => {
    if (attemptsCount >= 5) {
      setMpinError('You have exceeded the maximum number of retries. Please reset your PIN using the ‘Forgot PIN’ option');
    }
    storageService().set(pinAttemptsKey, attemptsCount);
  }, [attemptsCount]);

  useEffect(() => {
    if (mpin.length === 4) {
      setBottomText(<DotDotLoader />);
      handleClick();
    } else {
      setBottomText(`Enter ${productName} PIN`);
    }
  }, [mpin])

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await verifyPin({ mpin });
      storageService().remove(pinAttemptsKey);
      sendEvents("next");
      await postLoginSetup();
      if(config.diet) {
        await redirectToLaunchDiet();
      } else {
        redirectAfterLogin(
          { firstLogin: false },
          '',
          navigate
        );
      }
    } catch (err) {
      console.log(err);
      setMpinError(err);
      setAttemptsCount(attemptsCount + 1);
    } finally {
      setIsApiRunning(false);
    }
  }


  const sendEvents = (user_action) => {
    const sessionTimeout = storageService().getBoolean('session-timeout');
    let eventObj = {
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": '2fa_authentication',
        "journey": sessionTimeout ? 'account_inactive' : 'login',
      }
    };
    if(user_action === 'next') {
      storageService().setBoolean('session-timeout', false);
    }
    nativeCallback({ events: eventObj });
  };

  return (
    <div className="login-verify-pin">
      <EnterMPin
        otpProps={{
          otp: mpin,
          handleOtp: onOtpChange,
          isDisabled: isApiRunning || attemptsCount >= 5,
          hasError: !!mpinError,
          bottomText: mpinError || bottomText
        }}
      >
        <Imgc
          src={require(`assets/padlock1.svg`)}
          alt=""
          style={{ height: '20px', width: '20px', marginBottom: '10px' }}
        />
        <EnterMPin.Title className="lvp-title">
          Welcome back
        </EnterMPin.Title>
        <EnterMPin.Subtitle className="lvp-username">
          {name}
        </EnterMPin.Subtitle>
      </EnterMPin>
      <div className="lvp-footer">
        <WVButton color="secondary"
          onClick={() => {
            sendEvents("switch_account");
            navigate('/logout');
          }}
          disabled={isApiRunning}>
          Switch Account
        </WVButton>
        <WVButton
          color="secondary" 
          onClick={() => {
            sendEvents("forgot_pin");
            navigate('/forgot-pin');
          }} 
          disabled={isApiRunning}>
          Forgot PIN?
        </WVButton>
      </div>
    </div>
  );
}

export default VerifyPin;