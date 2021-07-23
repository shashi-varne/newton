import './commonStyles.scss';
import React, { useEffect, useState } from 'react';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from '../../../utils/validators';
import { navigate as navigateFunc } from '../../../utils/functions';
import { verifyPin } from '../../../2fa/common/ApiCalls';
import WVButton from '../../../common/ui/Button/WVButton';
import DotDotLoader from '../../../common/ui/DotDotLoaderNew';

const VerifyPin = (props) => {
  const { name } = storageService().getObject('user') || {};
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const onOtpChange = (val) => {
    setMpin(val);
    setMpinError('');
  }

  useEffect(() => {
    if (!mpin || !mpin.length) {
      setBottomText('Enter fisdom PIN');
    } else if (mpin.length === 4) {
      handleClick();
      setBottomText(<DotDotLoader />);
    } else {
      setBottomText('');
    }
  }, [mpin])

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await verifyPin({ mpin });
      // TODO: Handle post verification redirection
    } catch(err) {
      console.log(err);
      setMpinError(err);
    } finally {
      setIsApiRunning(false);
    }
  }

  return (
    <div className="login-verify-pin">
      <EnterMPin
        otpProps={{
          otp: mpin,
          handleOtp: onOtpChange,
          isDisabled: isApiRunning,
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
          Welcome back,
        </EnterMPin.Title>
        <EnterMPin.Subtitle className="lvp-username">
          {name}
        </EnterMPin.Subtitle>
      </EnterMPin>
      <div className="lvp-footer">
        <WVButton color="secondary" onClick={() => navigate('/login')} disabled={isApiRunning}>
          Switch Account
        </WVButton>
        <WVButton color="secondary" onClick={() => navigate('/forgot-pin')} disabled={isApiRunning}>
          Forgot PIN?
        </WVButton>
      </div>
    </div>
  );
}

export default VerifyPin;