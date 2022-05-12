import React, { useEffect, useMemo, useState } from "react";
import Container from "../../common/Container";
import { Tile } from "../mini-components/Tile";

import useUserKycHook from "../../common/hooks/userKycHook";
import isEmpty from "lodash/isEmpty";
import {
  getAocPaymentSummaryData,
  PAYMENT_SUMMARY_DATA,
} from "../common/constants";
import { PATHNAME_MAPPER } from "../../constants";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { getAocData, triggerAocPayment } from "../common/functions";
import { showTradingInfoScreen } from "../../common/functions";
import { getKycAppStatus } from "../../services";

import "./PaymentStatus.scss";

const PaymentSummary = (props) => {
  const navigate = navigateFunc.bind(props);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentSummaryContent, setPaymentSummaryContent] = useState({});
  const [errorData, setErrorData] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const config = useMemo(getConfig, []);

  useEffect(() => {
    const aocData = getAocData(kyc);
    const aocPaymentDetails = getAocPaymentSummaryData(aocData);
    setPaymentDetails(aocPaymentDetails);
    const status = getKycAppStatus(kyc).status;
    const summaryData =
      status === "upgraded_incomplete"
        ? PAYMENT_SUMMARY_DATA.upgrade
        : PAYMENT_SUMMARY_DATA.default;
    setPaymentSummaryContent(summaryData);
  }, [kyc]);

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "payment_summary",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {
    sendEvents("next");
    triggerAocPayment({
      setErrorData,
      setShowLoader,
      updateKyc,
      config,
    });
  };

  const handleGoBack = () => {
    sendEvents("back");
    const stateParams = props?.location?.state;
    const { fromState }  = stateParams || {};
    if (fromState || config.Web) {
      props.history.goBack();
    } else {
      const pathName = showTradingInfoScreen(kyc, config.productName) ? PATHNAME_MAPPER.tradingInfo : PATHNAME_MAPPER.aocSelectAccount;
      navigate(pathName)
    }
  }

  return (
    <Container
      skelton={isLoading}
      buttonTitle={paymentSummaryContent.buttonTitle}
      title="Payment summary"
      events={sendEvents("just_set_events")}
      showLoader={showLoader}
      errorData={errorData}
      showError={errorData.showError}
      handleClick={handleClick}
      data-aid="paymentSummary"
      headerData={{
        goBack: handleGoBack,
      }}
    >
      <div className="aoc-payment-summary" data-aid="summary">
        <div className="aoc-locker-details">
          <div className="aoc-ld-title">{paymentSummaryContent.title}</div>
          <div>{paymentSummaryContent.subtitle}</div>
        </div>
        {!isEmpty(paymentDetails) && (
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

export default PaymentSummary;
