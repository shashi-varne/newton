import React, { useEffect, useState } from "react";
import toast from "../../../common/ui/Toast";
import useUserKycHook from "../../common/hooks/userKycHook";
import { getUrlParams, isEmpty } from "../../../utils/validators";
import {
  isDigilockerFlow,
  navigate as navigateFunc,
} from "../../common/functions";
import { isReadyToInvest } from "../../services";
import { getPathname } from "../../constants";
import Container from "../../common/Container";

const CommunicationCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const { error } = getUrlParams();
  const { kyc, user, isLoading } = useUserKycHook();

  let checkUser = true;
  if (error) {
    checkUser = false;
    toast(error);
    navigate(getPathname.communicationDetails);
  }

  const [goNext] = useState(checkUser);

  useEffect(() => {
    if (!isEmpty(kyc) && goNext) {
      const isReadyToInvestBase = isReadyToInvest();
      if (isReadyToInvestBase) {
        navigate(getPathname.tradingExperience);
        return;
      }
      const isCompliant = kyc?.kyc_status === "compliant";
      const dlCondition = isDigilockerFlow();
      const isNri = kyc.address?.meta_data?.is_nri || false;
      let nextState = getPathname.personalDetails4;
      if (isCompliant) {
        if (isNri) nextState = getPathname.nriAddressDetails2;
        else nextState = getPathname.compliantPersonalDetails4;
      } else if (dlCondition) {
        nextState = getPathname.digilockerPersonalDetails3;
      }
      navigate(nextState);
    }
  }, [kyc, user]);

  return <Container skelton={isLoading} noHeader noFooter />;
};

export default CommunicationCallback;
