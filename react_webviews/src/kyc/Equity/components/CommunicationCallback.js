import React, { useEffect, useState } from "react";
import toast from "../../../common/ui/Toast";
import useUserKycHook from "../../common/hooks/userKycHook";
import { getUrlParams, isEmpty } from "../../../utils/validators";
import { isDigilockerFlow } from "../../common/functions";
import { PATHNAME_MAPPER } from "../../constants";
import Container from "../../common/Container";
import { navigate as navigateFunc } from "../../../utils/functions";

const CommunicationCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const { error } = getUrlParams();
  const { kyc, user, isLoading } = useUserKycHook();

  let checkUser = true;
  if (error) {
    checkUser = false;
    toast(error);
    navigate(PATHNAME_MAPPER.communicationDetails);
  }

  const [goNext] = useState(checkUser);

  useEffect(() => {
    if (!isEmpty(kyc) && goNext) {
      if (kyc.mf_kyc_processed) {
        navigate(PATHNAME_MAPPER.tradingExperience);
        return;
      }
      const isCompliant = kyc?.kyc_status === "compliant";
      const dlCondition = isDigilockerFlow(kyc);
      const isNri = kyc.address?.meta_data?.is_nri || false;
      let nextState = PATHNAME_MAPPER.personalDetails4;
      if (isCompliant) {
        if (isNri) nextState = PATHNAME_MAPPER.nriAddressDetails2;
        else nextState = PATHNAME_MAPPER.compliantPersonalDetails4;
      } else if (dlCondition) {
        nextState = PATHNAME_MAPPER.digilockerPersonalDetails3;
      }
      navigate(nextState);
    }
  }, [kyc, user]);

  return <Container skelton={isLoading} noHeader noFooter />;
};

export default CommunicationCallback;
