import React, { useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { isKycCompleted } from '../../common/functions';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import useUserKycHook from '../../common/hooks/userKycHook';
import { nativeCallback } from '../../../utils/native_callback';
import { getKycAppStatus } from '../../services';
import VerifyDetailDialog from '../../../login_and_registration/components/VerifyDetailDialog';
import { storageService } from '../../../utils/validators';
import Container from '../../common/Container';

const HandleDirectEntry = (props) => {
  const { kyc, user } = useUserKycHook();
  const [isOpen, setIsOpen] = useState(false);
  const [contactType, setContactType] = useState('');
  const [contactData, setContactData] = useState('');
  const config = useMemo(getConfig, []);
  const type = props.match?.params?.type;
  const navigate = navigateFunc.bind(props);
  const parent = {
    navigate,
  };

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      validateUser(kyc, user);
    }
  }, [kyc, user]);

  const initiatePinSetup = () => {
    if (config?.isSdk) {
      window.callbackWeb['open_2fa_module']({
        operation: 'setup_pin',
        request_code: 'REQ_SETUP_2FA',
        callback: function (data) {
          if (data.status === 'success') {
            navigate('/');
          }
        },
      });
    } else {
      // currently keeping it as a fallback for web, if direct entry is accessed from web.
      navigate('/');
    }
  };

  const handleStockRedirection = (stateData) => {
    const { kycData, kycJourneyStatus, currentUser } = stateData;
    const isKycDone = isKycCompleted(kycData);
    if (
      kycData.equity_investment_ready ||
      (kycJourneyStatus === 'complete' && kycData.kyc_product_type === 'equity')
    ) {
      if (currentUser?.pin_status !== 'pin_setup_complete') {
        initiatePinSetup('stocks');
        return;
      } else if (kycJourneyStatus !== 'fno_rejected') {
        if (config.isSdk) {
          nativeCallback({
            action: 'open_equity',
          });
        } else {
          window.location.href = `${config.base_url}/page/equity/launchapp`;
        }
        return;
      } else {
        navigate('/');
      }
    } else if (isKycDone) {
      navigate('/');
    } else {
      navigate('/kyc/journey');
    }
  };

  const validateUser = (kycData, currentUser) => {
    if (type === 'tpp') {
      navigate('/product-types');
      return;
    }
    const kycJourneyStatus = getKycAppStatus(kycData)?.status;
    const { mobile_number_verified, email_verified } = kycData?.identification?.meta_data;
    const isUserAuthenticated = mobile_number_verified && email_verified;
    const data = {
      kycData,
      currentUser,
      kycJourneyStatus,
    };
    if (!isUserAuthenticated) {
      
      // this bool val will help in redirecting to landing page, once the otp is verified.
      storageService().setBoolean('sdkStocksRedirection', true);

      if(!currentUser?.mobile || !currentUser?.email) {
        navigate('/secondary-verification',{
          state: {
            fromDirectEntry: true
          }
        });
        return;
      }
      if (!mobile_number_verified) {
        setContactType('mobile');
        setContactData(currentUser?.mobile);
      } else {
        setContactType('email');
        setContactData(currentUser?.email);
      }
      setIsOpen(true);
    } else {
      if (type === 'equity') {
        handleStockRedirection(data);
      } else {
        navigate('/');
      }
    }
  };

  if (!user) return null;
  return (
    <Container skelton={true} noBackIcon>
      <div>
        {contactType && (
          <VerifyDetailDialog
            type={contactType}
            data={{ contact_value: contactData }}
            isOpen={isOpen}
            parent={parent}
          />
        )}
      </div>
    </Container>
  );
};

export default HandleDirectEntry;
