import React, { useEffect } from 'react'
import { navigate as navigateFunc } from '../common/functions'
import { isEmpty, getUrlParams, storageService } from '../../utils/validators'
import { getKycAppStatus } from '../services'
import useUserKycHook from "../common/hooks/userKycHook";
import Container from '../common/Container';

function Native(props) {
  const navigate = navigateFunc.bind(props);
  const urlParams = getUrlParams(props?.location?.search);
  const { kyc, isLoading } = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      let kycStatus = getKycAppStatus(kyc).status || '';
      storageService().set("native", true);

      if (urlParams?.type === 'addbank') {
       navigate("/kyc/approved/banks/doc");
      } else if (urlParams?.type === 'banklist') {
         navigate('/kyc/add-bank');
      } else if (kycStatus === 'ground') {
         navigate('/kyc/home');
      } else if (kycStatus === "ground_pan") {
        navigate("/kyc/journey", {
          state: {
            show_aadhaar: !kyc.address.meta_data.is_nri ? true : false,
          }
        });
      } else {
        navigate('/kyc/journey');
      }
    }
  }, [kyc])

  return (
    <Container skelton={isLoading} noHeader noFooter />
  )
}

export default Native;
