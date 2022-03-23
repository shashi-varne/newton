import React, { useEffect, useMemo, useState } from "react";
import Container from "../../common/Container";
import { Imgc } from "../../../common/ui/Imgc";
import WVPageTitle from "../../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
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
import useAocDataHook from "../common/aocDataHook";
import {
  getAocPaymentSummaryData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";

import "./PaymentStatus.scss";

const PaymentStatus = (props) => {
  const { productName } = useMemo(getConfig, []);
  const [paymentStatusData, setPaymentStatusData] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [showLoader] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const { kyc, updateKyc } = useUserKycHook();
  const [errorData, setErrorData] = useState({});
  const { aocData } = useAocDataHook();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const data =
      PAYMENT_STATUS_DATA[kyc?.equity_aoc_payment_status] ||
      PAYMENT_STATUS_DATA["success"];
    setPaymentStatusData(data);
    if (data.isSuccess) {
      const aocPaymentDetails = getAocPaymentSummaryData(aocData);
      setPaymentDetails(aocPaymentDetails);
    }
  }, [kyc]);

  const initialize = async () => {
    setShowSkelton(true);
    try {
      const result = await getUserKycFromSummary();
      let userKyc = get(result, "data.kyc.kyc.data", {});
      if (!isEmpty(userKyc)) {
        updateKyc(userKyc);
      }
    } catch (err) {
      Toast(err.message, "error");
      setErrorData();
    } finally {
      setShowSkelton(false);
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "NRI_not_available",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {};

  const redirectToHome = () => {
    if (paymentStatusData.isSuccess) {
      handleNativeExit(props, { action: "exit" });
    } else {
    }
  };

  return (
    <Container
      headerData={{
        icon: "close",
        goBack: redirectToHome,
      }}
      hidePageTitle
      skelton={showSkelton}
      showLoader={showLoader}
      errorData={errorData}
      showError={errorData.showError}
      buttonTitle={paymentStatusData.buttonTitle}
      title={paymentStatusData.title}
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="aocPaymentStatus"
    >
      <div
        className="aoc-payment-status"
        data-aid={`pg_${paymentStatusData.id}`}
      >
        {!isEmpty(paymentStatusData) && (
          <Imgc
            src={require(`assets/${productName}/${paymentStatusData.icon}`)}
            className="aoc-icon"
            dataAid="top"
          />
        )}
        <WVPageTitle dataAidSuffix="title">
          {paymentStatusData.title}
        </WVPageTitle>
        <WVPageSubtitle dataAidSuffix="description">
          {paymentStatusData.subtitle}
        </WVPageSubtitle>
        {paymentStatusData.isSuccess && !isEmpty(paymentDetails) && (
          <>
            <div className="aoc-success-title" data-aid="tv_title">
              {paymentDetails.title}
            </div>
            {paymentDetails.data.map((el, index) => (
              <Tile key={index} {...el} index={index} />
            ))}
          </>
        )}
      </div>
    </Container>
  );
};

export default PaymentStatus;

const Tile = ({ title, amount, className = "", showDivider, index }) => (
  <>
    <div
      className={`flex-between-center aoc-ps-content ${className}`}
      data-aid={`grp_tile${index + 1}`}
    >
      <div className="aoc-ps-title" data-aid="tv_title">
        {title}
      </div>
      <div className="aoc-ps-subtitle" data-aid="tv_description">
        {amount}
      </div>
    </div>
    {showDivider && (
      <div className="generic-hr" data-aid={`separator_${index + 1}`} />
    )}
  </>
);
