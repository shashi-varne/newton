import React, { useEffect, useState } from 'react'
import { navigate as navigateFunc } from 'utils/functions'
import { isEmpty, storageService } from '../../utils/validators'
import { getKycAppStatus, setKycProductType } from '../services'
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from '../../utils/native_callback';
import Container from '../common/Container';
import { kycStatusMapperInvest } from '../../dashboard/Invest/constants';
import { isKycCompleted } from '../common/functions';
import { PATHNAME_MAPPER } from '../constants';

function Native(props) {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const { kyc, isLoading } = useUserKycHook();
  const fromState = props?.location?.state?.fromState || "";

  const data = {
    state: {
      goBack: "exit",
    }
  }

  if (fromState) {
    nativeCallback({ action: "exit_web"});
    return;
  }

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc])

  const setProductType = async () => {
    try {
      const payload = {
        "kyc":{},
        "set_kyc_product_type": "equity"
      }
      setIsApiRunning(true);
      const isProductTypeSet = await setKycProductType(payload);
      if (isProductTypeSet) {
        navigate(PATHNAME_MAPPER.accountInfo, data)
      }
    } catch (ex) {
      console.log(ex.message);
      nativeCallback({ action: "exit_web" })
    } finally {
      setIsApiRunning(false);
    }
  }

  const initialize = () => {
    let kycJourneyStatus = getKycAppStatus(kyc).status || '';
    storageService().set("native", true);
    storageService().set("kycStartPoint", "stocks");
    let kycStatusData = kycStatusMapperInvest[kycJourneyStatus];
    if (kyc.kyc_status === "compliant") {
      if (["init", "incomplete"].indexOf(kycJourneyStatus) !== -1) {
        kycStatusData = kycStatusMapperInvest["ground_premium"];
      }
    }

    if (kyc?.address?.meta_data?.is_nri && isKycCompleted(kyc)) {
      navigate(PATHNAME_MAPPER.nriError, {
        state: { 
          originState: "invest",
          ...data.state
        },
      });
    } else {
      if (kycJourneyStatus !== "rejected") {
        if (kycJourneyStatus === "ground") {
          navigate(PATHNAME_MAPPER.stocksStatus, data);
        } else if (kycJourneyStatus === "ground_pan") {
          navigate(PATHNAME_MAPPER.journey, {
            state: {
              show_aadhaar: !kyc.address.meta_data.is_nri ? true : false,
              fromState: "invest",
              ...data.state
            },
          });
        } else if (kyc?.kyc_product_type !== "equity") {
          setProductType();
        } else {
          navigate(kycStatusData.next_state, {
            state: { 
              fromState: "invest", 
              ...data.state
            },
          });
        }
      } else {
        nativeCallback({ action: "exit_web" })
      }
    }
  }

  return (
    <Container skelton={isLoading || isApiRunning} noHeader noFooter />
  )
}

export default Native;
