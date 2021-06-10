import React, { useEffect } from 'react'
import { navigate as navigateFunc } from 'utils/functions'
import { isEmpty, getUrlParams, storageService } from '../../utils/validators'
import { getKycAppStatus } from '../services'
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from '../../utils/native_callback';
import Container from '../common/Container';

function Native(props) {
  const navigate = navigateFunc.bind(props);
  const urlParams = getUrlParams(props?.location?.search);
  const { kyc, isLoading } = useUserKycHook();
  const fromState = props?.location?.state?.fromState || "";

  if (fromState) {
    nativeCallback({ action: "exit_web"});
    return;
  }

  useEffect(() => {
    if (!isEmpty(kyc)) {
      let kycStatus = getKycAppStatus(kyc).status || '';
      storageService().set("native", true);

      const data = {
        state: {
          goBack: "exit",
        }
      }
      if (urlParams?.type === 'addbank') {
        navigate("/kyc/approved/banks/doc", data);
      } else if (urlParams?.type === 'banklist') {
         navigate('/kyc/add-bank', data);
      } else if (kycStatus === 'ground') {
         navigate('/kyc/home', data);
      } else if (kycStatus === "ground_pan") {
        navigate("/kyc/journey", {
          state: {
            ...data.state,
            show_aadhaar: !kyc.address.meta_data.is_nri ? true : false,
          }
        });
      } else {
        navigate('/kyc/journey', data);
      }
    }
  }, [kyc])

  return (
    <Container skelton={isLoading} noHeader noFooter />
  )
}

export default Native;
