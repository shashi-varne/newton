import React, { useEffect, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import { isKycCompleted } from '../../common/functions';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import useUserKycHook from '../../common/hooks/userKycHook';
import { nativeCallback } from "../../../utils/native_callback";

const HandleDirectEntry = (props) => {
  const { kyc } = useUserKycHook();
  const config = useMemo(getConfig, []);
  const type = props.match?.params?.type;
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (!isEmpty(kyc)) {
      validateUser(kyc);
    }
  }, [kyc]);

  const validateUser = (kycData) => {
    if (type === 'tpp') {
      navigate('/product-types');
      return;
    }
    const { mobile_number_verified, email_verified } = kycData?.identification?.meta_data;
    const isKycDone = isKycCompleted(kycData);
    const isUserAuthenticated = mobile_number_verified && email_verified;
    if (isKycDone && isUserAuthenticated) {
      if (type === 'equity') {
        if (config.isSdk) {
          nativeCallback({
            action: "open_equity"
          })
        } else {
          window.location.href = `${config.base_url}/page/equity/launchapp`;
        }
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return <div />;
};

export default HandleDirectEntry;
