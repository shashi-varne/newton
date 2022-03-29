import React, { useEffect, useState } from "react";
import Container from "../../common/Container";

import { Tile } from "../mini-components/Tile";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import useUserKycHook from "../../common/hooks/userKycHook";
import { getAocPaymentSummaryData } from "../common/constants";
import { nativeCallback } from "../../../utils/native_callback";

import "./PaymentStatus.scss";
import { triggerAocPaymentDecision } from "../../common/api";

const PaymentSummary = (props) => {
  const [paymentDetails, setPaymentDetails] = useState({});
  const [errorData, setErrorData] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const { kyc, isLoading, updateKyc } = useUserKycHook();

  useEffect(() => {
    const accountOpeningData = get(kyc, "equity_account_charges_v2.account_opening", {})
    const aocData = {
      amount: accountOpeningData?.base?.rupees,
      totalAmount: accountOpeningData.total?.rupees,
      gst: accountOpeningData.gst?.rupees,
      gstPercentage: accountOpeningData.gst?.percentage || ""
    };
    const aocPaymentDetails = getAocPaymentSummaryData(aocData);
    setPaymentDetails(aocPaymentDetails);
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

  const handleClick = async () => {
    setErrorData({});
    sendEvents("next");
    try {
      setShowLoader("button");
      const result = await triggerAocPaymentDecision("accept");
      if (result.kyc) {
        updateKyc(result.kyc);
      }
      setShowLoader("page");
      window.location.href = result.payment_link;
    } catch (err) {
      setErrorData({
        showError: true,
        title2: err.message,
        handleClick1: handleClick,
      });
      setShowLoader(false);
    }
  };

  return (
    <Container
      skelton={isLoading}
      buttonTitle="PAY NOW"
      title="Payment summary"
      events={sendEvents("just_set_events")}
      showLoader={showLoader}
      errorData={errorData}
      showError={errorData.showError}
      handleClick={handleClick}
      data-aid="paymentSummary"
    >
      <div className="aoc-payment-summary" data-aid="summary">
        <div className="aoc-locker-details">
          <div className="aoc-ld-title">
            Trading & Demat + Mutual Fund account
          </div>
          <div>Stocks, Mutual funds, IPOs, NCDs, SGBs</div>
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
