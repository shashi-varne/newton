import React, { useEffect, useState } from 'react'
import { navigate as navigateFunc } from 'utils/functions'
import { isEmpty, getUrlParams, storageService } from '../../utils/validators'
import { getKycAppStatus, isReadyToInvest, setKycProductType } from '../services'
import useUserKycHook from "../common/hooks/userKycHook";
import { nativeCallback } from '../../utils/native_callback';
import Container from '../common/Container';
import { PATHNAME_MAPPER } from '../constants';
import { getConfig, isTradingEnabled } from '../../utils/functions';
import { kycStatusMapperInvest } from '../../dashboard/Invest/constants';


function KycNative(props) {
  const config = getConfig();
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const urlParams = getUrlParams(props?.location?.search);
  const { kyc, isLoading } = useUserKycHook();
  const fromState = props?.location?.state?.fromState || "";
  const isReadyToInvestUser = isReadyToInvest();

  if (fromState) {
    nativeCallback({ action: "exit_web"});
    return;
  }

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const setProductType = async () => {
    try {
      const payload = {
        "kyc":{},
        "set_kyc_product_type": "equity"
      }
      setIsApiRunning(true);
      const result = await setKycProductType(payload);
      return result;
    } catch (ex) {
      console.log(ex.message);
      nativeCallback({ action: "exit_web" })
    } finally {
      setIsApiRunning(false);
    }
  };

  const initialize = async () => {
    let kycStatus = getKycAppStatus(kyc).status || '';
    let kycStatusData = kycStatusMapperInvest[kycStatus];
    storageService().set("native", true);
    const TRADING_ENABLED = isTradingEnabled(kyc);
    const isBrokingActivated = false; // To be removed after we get flag from backend
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
          show_aadhaar: !(kyc.address.meta_data.is_nri || kyc.kyc_type === "manual"),
        }
      });
    } else if (kycStatus === "submitted") {
      nativeCallback({ action: "exit_web"});
    } else if (kycStatus === "esign_pending") {
      navigate("/kyc-esign/info");
    } 
    // Todo: remove this condition after audit
    else if (kycStatus === "complete" && kyc.equity_sign_status === "signed" && !isBrokingActivated) {
      navigate("/kyc-esign/nsdl", {
        searchParams: `${getConfig().searchParams}&status=success`
      });
    } else if (kycStatus === "fno_rejected") {
      navigate("/kyc/upload/fno-income-proof");
    } else if ((TRADING_ENABLED && kyc?.kyc_product_type !== "equity") || kyc?.mf_kyc_processed) {
      let result;
      if (!kyc?.mf_kyc_processed) {
        result = await setProductType();
      }
      
      // already kyc completed users
      if (isReadyToInvestUser && (result?.kyc?.mf_kyc_processed || kyc?.mf_kyc_processed)) {
        navigate(PATHNAME_MAPPER.accountInfo)
      } else {
        const showAadhaar = !(result?.kyc?.address.meta_data.is_nri || result?.kyc?.kyc_type === "manual");
        if (result?.kyc?.kyc_status !== "compliant") {
          navigate(PATHNAME_MAPPER.journey, {
            searchParams: `${config.searchParams}&show_aadhaar=${showAadhaar}`
          });
        } else {
          navigate(PATHNAME_MAPPER.journey)
        }
      }
    } else {
      navigate(kycStatusData.next_state, data);
    }
  }

  return (
    <Container skelton={isLoading || isApiRunning} noHeader noFooter />
  );
}

export default KycNative;
