import React, { useEffect, useState } from "react";
import Container from "../../common/Container";

import { Tile } from "../mini-components/Tile";

import isEmpty from "lodash/isEmpty";
import useUserKycHook from "../../common/hooks/userKycHook";
import { getAocPaymentSummaryData } from "../common/constants";
import { nativeCallback } from "../../../utils/native_callback";

import "./PaymentStatus.scss";

const PaymentSummary = (props) => {
  const [paymentDetails, setPaymentDetails] = useState({});
  const { kyc, isLoading } = useUserKycHook();

  useEffect(() => {
    const aocData = {
      amount: kyc.equity_account_charges.amount || 200,
      total_amount: kyc.equity_account_charges.total_amount || 300,
      gst: kyc.equity_account_charges.gst || 100,
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

  const handleClick = () => {
    sendEvents("next");
  };

  return (
    <Container
      skelton={isLoading}
      buttonTitle="PAY NOW"
      title="Payment summary"
      events={sendEvents("just_set_events")}
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
