import React, { useEffect, useMemo, useState } from "react";
import Container from "../../common/Container";
import Toast from "../../../common/ui/Toast";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import {
  handleNativeExit,
  nativeCallback,
} from "../../../utils/native_callback";
import { getConfig } from "../../../utils/functions";
import { getUserKycFromSummary } from "../../common/api";
import useUserKycHook from "../../common/hooks/userKycHook";
import {
  getAocPaymentSummaryData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";

import "./PaymentStatus.scss";

const SelectAccountType = (props) => {
  const { productName } = useMemo(getConfig, []);
  const { kyc, isLoading } = useUserKycHook();

  useEffect(() => {
    
  }, [kyc]);

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "select_account_type",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {};

  return (
    <Container
      skelton={isLoading}
      buttonTitle=""
      title=""
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="aocSelectAccountType"
    >

    </Container>
  );
};

export default SelectAccountType;
