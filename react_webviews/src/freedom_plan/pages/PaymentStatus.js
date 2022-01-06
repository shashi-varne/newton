import React, { useMemo } from "react";
import Container from "../common/Container";
import { getConfig } from "../../utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import WVPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import {
  getPaymentSummaryData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";
import { handleNativeExit, nativeCallback } from "../../utils/native_callback";
import Tile from "../mini-components/Tile";
import { getUrlParams } from "../../utils/validators";
import useFreedomDataHook from "../common/freedomPlanHook";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import "./PaymentStatus.scss";

const PaymentStatus = (props) => {
  const { productName } = useMemo(getConfig, []);
  const { status } = getUrlParams();
  const paymentStatusData = useMemo(
    () => PAYMENT_STATUS_DATA[status] || PAYMENT_STATUS_DATA["failed"],
    []
  );
  const { isLoading, kyc } = useUserKycHook();
  const {
    errorData,
    showLoader,
    freedomPlanData,
    initiatePayment,
  } = useFreedomDataHook();
  const paymentDetails = useMemo(getPaymentSummaryData(freedomPlanData), [
    freedomPlanData,
  ]);

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: paymentStatusData.screenName,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {
    if (paymentStatusData.isSuccess || !freedomPlanData.plan_id) {
      sendEvents("next");
      redirectToHome();
    } else {
      retryPayment();
    }
  };

  const retryPayment = () => {
    sendEvents("retry");
    initiatePayment({
      ucc: kyc.ucc,
      amount: freedomPlanData.amount,
      gst: freedomPlanData.gst,
      total_amount: freedomPlanData.total_amount,
      plan_id: freedomPlanData.plan_id,
    });
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
      skelton={isLoading}
      showLoader={showLoader}
      errorData={errorData}
      showError={errorData.showError}
      buttonTitle={paymentStatusData.buttonTitle}
      title={paymentStatusData.title}
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="freedom-plan-payment-status"
    >
      <div className="freedom-plan-payment-status">
        <Imgc
          src={require(`assets/${productName}/${paymentStatusData.icon}`)}
          className="fpps-icon"
        />
        <WVPageTitle>{paymentStatusData.title}</WVPageTitle>
        <WVPageSubtitle>{paymentStatusData.subtitle}</WVPageSubtitle>
        {paymentStatusData.isSuccess && (
          <>
            <div className="fpps-title">Payment summary</div>
            {paymentDetails.map((data, index) => (
              <Tile key={index} {...data} />
            ))}
          </>
        )}
      </div>
    </Container>
  );
};

export default PaymentStatus;
