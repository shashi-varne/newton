import React, { useEffect, useMemo, useState } from "react";
import Container from "../../common/Container";
import { Imgc } from "../../../common/ui/Imgc";
import WVPageTitle from "../../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
import Toast from "../../../common/ui/Toast";
import { Tile } from "../mini-components/Tile";

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
  getAocPaymentStatusData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";

import "./PaymentStatus.scss";

const PaymentStatus = (props) => {
  const { productName } = useMemo(getConfig, []);
  const [paymentStatusData, setPaymentStatusData] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [errorData, setErrorData] = useState({});
  const [count, setCount] = useState(30);
  const [countdownInterval, setCountdownInterval] = useState();
  const { kyc, updateKyc } = useUserKycHook();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const data =
      PAYMENT_STATUS_DATA[kyc?.equity_aoc_payment_status] ||
      PAYMENT_STATUS_DATA["failed"];
    setPaymentStatusData(data);
    if (data.isSuccess) {
      const accountOpeningData = get(
        kyc,
        "equity_account_charges_v2.account_opening",
        {}
      );
      const aocData = {
        amount: accountOpeningData?.base?.rupees,
        totalAmount: accountOpeningData.total?.rupees,
        gst: accountOpeningData.gst?.rupees,
        gstPercentage: accountOpeningData.gst?.percentage || "",
      };
      const aocPaymentDetails = getAocPaymentStatusData(aocData);
      setPaymentDetails(aocPaymentDetails);
    }
  }, [kyc]);

  const initialize = async () => {
    setShowLoader("page");
    let value = count;
    let intervalId = setInterval(() => {
      value--;
      if (value === 20) {
        getUserKycFromSummary();
      } else if (value === 0) {
        clearInterval(intervalId);
        setCountdownInterval(null);
        getUserKycFromSummary();
        setShowLoader(false);
      }
      setCount(value);
    }, 1000);
    setCountdownInterval(intervalId);

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
