import React, { useEffect, useMemo, useState } from "react";
import Container from "../../common/Container";
import { Imgc } from "../../../common/ui/Imgc";
import WVPageTitle from "../../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
import { Tile } from "../mini-components/Tile";

import isEmpty from "lodash/isEmpty";

import {
  handleNativeExit,
  nativeCallback,
} from "../../../utils/native_callback";
import { getConfig } from "../../../utils/functions";
import { checkPaymentStatus } from "../../common/api";
import useUserKycHook from "../../common/hooks/userKycHook";
import {
  AOC_STORAGE_CONSTANTS,
  getAocPaymentStatusData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";
import { getUrlParams, storageService } from "../../../utils/validators";
import { getAocData, triggerAocPayment } from "../common/functions";

import "./PaymentStatus.scss";

const PaymentStatus = (props) => {
  const config = useMemo(getConfig, []);
  const [paymentStatusData, setPaymentStatusData] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [errorData, setErrorData] = useState({});
  const [count, setCount] = useState(10);
  const [countdownInterval, setCountdownInterval] = useState();
  const { kyc, updateKyc } = useUserKycHook();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const { status } = getUrlParams();
    if (status === "success") {
      const data = PAYMENT_STATUS_DATA.success;
      setPaymentStatusData(data);
      const aocData = getAocData(kyc);
      const aocPaymentDetails = getAocPaymentStatusData(aocData);
      setPaymentDetails(aocPaymentDetails);
    } else {
      setShowLoader("page");
      let value = count;
      let intervalId = setInterval(() => {
        value--;
        if (value === 29) {
          checkAocPaymentStatus(false);
        } else if (value === 3) {
          checkAocPaymentStatus(true);
        }
        setCount(value);
      }, 1000);
      setCountdownInterval(intervalId);
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

  const checkAocPaymentStatus = async (refund = false) => {
    const aocPaymentData = storageService().getObject(
      AOC_STORAGE_CONSTANTS.AOC_PAYMENT_DATA
    );
    try {
      const result = await checkPaymentStatus({
        paymentId: aocPaymentData.payment_id,
        pptId: aocPaymentData.ppt_id,
        refund,
      });
      if (result.status === "success" || refund) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
        const data =
          PAYMENT_STATUS_DATA[result.status] || PAYMENT_STATUS_DATA["failed"];
        setPaymentStatusData(data);
        if (data.isSuccess) {
          const aocData = getAocData(kyc);
          const aocPaymentDetails = getAocPaymentStatusData(aocData);
          setPaymentDetails(aocPaymentDetails);
        }
        setShowLoader(false);
      }
    } catch (err) {
      console.log("er ", err);
      if (refund) {
        const handleRetry = () => {
          setErrorData({});
          setShowLoader("page");
          checkAocPaymentStatus(true);
        };
        setErrorData({
          showError: "page",
          title2: err.message,
          handleClick1: handleRetry,
        });
        setShowLoader(false);
      }
    }
  };

  const handleClick = () => {
    const aocPaymentData = storageService().getObject(
      AOC_STORAGE_CONSTANTS.AOC_PAYMENT_DATA
    );
    if (paymentStatusData.isSuccess || !aocPaymentData.payment_link) {
      redirectToHome();
    } else {
      triggerAocPayment({
        setErrorData,
        setShowLoader,
        updateKyc,
        config,
      });
    }
  };

  const redirectToHome = () => {
    handleNativeExit(props, { action: "exit" });
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
            src={require(`assets/${config.productName}/${paymentStatusData.icon}`)}
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
