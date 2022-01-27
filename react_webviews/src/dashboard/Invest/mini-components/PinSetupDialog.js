import React, { useEffect, useMemo, useState } from 'react';
import WVFullscreenDialog from '../../../common/ui/FullscreenDialog/WVFullscreenDialog';
import EnterMPin from "../../../2fa/components/EnterMPin";
import { verifyPin, setPin as setNewPin } from '../../../2fa/common/apiCalls';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import WVButton from '../../../common/ui/Button/WVButton';
import { getKycFromSummary } from "../../../login_and_registration/functions";
import BackArrow from '@material-ui/icons/ChevronLeft';
import { withRouter } from 'react-router-dom';
import WVInPageTitle from '../../../common/ui/InPageHeader/WVInPageTitle';
import { Imgc } from '../../../common/ui/Imgc';

const PinSetupDialog = ({
  open,
  onClose,
  comingFrom,
  ...props
}) => {
  const { productName, base_url } = useMemo(() => getConfig(), []);
  const navigate = navigateFunc.bind(props);
  const [screen, setScreen] = useState('set');
  const [pinError, setPinError] = useState(false);
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  useEffect(() => {
    if (screen === 'set') {
      setPin1('');
    } else {
      setPin2('');
    }
    setPinError('');
  }, [screen]);

  const handleClick = async () => {
    if (screen !== 'success') {
      try {
        setIsApiRunning(true);
        if (screen === 'set') {
          await verifyPin({
            validate_only: true,
            mpin: pin1
          });
          setScreen('confirm');
        } else if (screen === 'confirm') {
          if (pin2 !== pin1) {
            // eslint-disable-next-line no-throw-literal
            throw "PIN doesn't match, Please try again";
          } else {
            await setNewPin({ mpin: pin2 });
            await getKycFromSummary({
              kyc: ["kyc"],
              user: ["user"]
            });
            setScreen('success');
          }
        }
      } catch (err) {
        console.log(err);
        setPinError(err);
      } finally {
        setIsApiRunning(false);
      }
    } else {
      // when pin setup is successful
      if (comingFrom === 'stocks') {
        setIsApiRunning(true);
        window.location.href = `${base_url}/page/equity/launchapp`;
      } else {
        navigate("/market-products");
      }
    }
  }

  const onPinChange = (val) => {
    if (screen === 'set') {
      setPin1(val);
    } else {
      setPin2(val);
    }
    setPinError('');
  }

  const onCloseClicked = () => {
    if (screen === 'set' || screen === 'success') {
      onClose();
    } else {
      setScreen('set');
    }
  }

  return (
    <WVFullscreenDialog
      open={open}
      onClose={onCloseClicked}
      closeIconPosition='left'
      customCloseIcon={screen === 'confirm' ? BackArrow : ''}
    >
      <WVFullscreenDialog.Content>
        <div style={{ paddingTop: '60px' }}>
          {screen !== 'success' ?
            <EnterMPin
              title={`${screen === 'set' ? 'Set' : 'Confirm'} ${productName} PIN`}
              subtitle="Add an extra layer of security"
              otpProps={{
                otp: screen === 'set' ? pin1 : pin2,
                handleOtp: onPinChange,
                hasError: !!pinError,
                bottomText: pinError || '',
              }}
            /> :
            <PinSetupSuccess productName={productName} />
          }
        </div>
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <WVButton
          contained
          fullWidth
          color="secondary"
          onClick={handleClick}
          showLoader={isApiRunning}
        >
          Continue
        </WVButton>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
}

const PinSetupSuccess = ({ productName }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Imgc
        style={{ width: '90px' }}
        src={require(`assets/${productName}/pin_changed.svg`)}
        alt="security-enabled"
      />
      <WVInPageTitle style={{ marginTop: '40px' }}>{productName} security enabled</WVInPageTitle>
    </div>
  )
}

export default withRouter(PinSetupDialog);