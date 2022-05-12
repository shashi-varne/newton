import React, { useEffect, useMemo, useState } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import WVPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import {
  FREEDOM_PLAN_STORAGE_CONSTANTS,
  getPaymentSummaryData,
  PATHNAME_MAPPER,
  PAYMENT_STATUS_DATA,
} from "../common/constants";
import { nativeCallback } from "../../utils/native_callback";
import Tile from "../mini-components/Tile";
import { getUrlParams, storageService } from "../../utils/validators";
import useFreedomDataHook from "../common/freedomPlanHook";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import "./PaymentStatus.scss";
import { handleExit } from "../common/functions";
import isEmpty from "lodash/isEmpty";
import Toast from "../../common/ui/Toast";
import { getAccountSummary } from "../../kyc/services";

const PaymentStatus = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showSkelton, setShowSkelton] = useState(false);
  const initialize = () => {
    const { status, message = "" } = getUrlParams();
    let paymentStatusData = PAYMENT_STATUS_DATA[status] || PAYMENT_STATUS_DATA["failed"];
    if(!paymentStatusData.isSuccess && !isEmpty(message)) {
      paymentStatusData.subtitle = decodeURIComponent(message);
    }
    return {
      ...getConfig(),
      paymentStatusData,
    };
  };

  const { productName, paymentStatusData, iOS } = useMemo(initialize, []);

  const { isLoading, kyc } = useUserKycHook();

  const {
    errorData,
    showLoader,
    freedomPlanData,
    initiatePayment,
    resetFreedomPlan,
  } = useFreedomDataHook();

  const paymentDetails = useMemo(getPaymentSummaryData(freedomPlanData), [
    freedomPlanData,
  ]);

  const fetchSubscriptionStatus = async () => {
    try {
      setShowSkelton(true);
      const result = await getAccountSummary({
        equity: ["subscription_status"],
      });
      const subscriptionStatus = result?.data?.equity?.subscription_status?.data || {};
      if (!isEmpty(subscriptionStatus)) {
        storageService().setObject(FREEDOM_PLAN_STORAGE_CONSTANTS.subscriptionStatus, subscriptionStatus);
      }
    } catch (err) {
      Toast(err.message);
    } finally {
      setShowSkelton(false)
    }
  };

  useEffect(() => {
    if (iOS) {
      nativeCallback({ action: 'hide_top_bar' });
    }
    if(paymentStatusData.isSuccess) {
      fetchSubscriptionStatus();
    }
  }, [])

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
    if (paymentStatusData.isSuccess) {
      sendEvents("next");
      redirectToHome(true);
    } else {
      retryPayment();
    }
  };

  const retryPayment = () => {
    sendEvents("retry");
    if (!freedomPlanData.id) {
      navigate(PATHNAME_MAPPER.landing);
      return;
    }
    initiatePayment({
      ucc: kyc.ucc,
      amount: freedomPlanData.amount,
      gst: freedomPlanData.gst,
      total_amount: freedomPlanData.total_amount,
      plan_id: freedomPlanData.id,
    });
  };

  const redirectToHome = (sendEvents = false) => {
    if (!sendEvents) {
      sendEvents("back");
    }
    resetFreedomPlan();
    handleExit(props);
  };

  return (
    <Container
      headerData={{
        icon: "close",
        goBack: redirectToHome,
      }}
      hidePageTitle
      skelton={isLoading || showSkelton}
      showLoader={showLoader}
      errorData={errorData}
      showError={errorData.showError}
      buttonTitle={paymentStatusData.buttonTitle}
      title={paymentStatusData.title}
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="freedomPlanPaymentStatus"
    >
      <div className="freedom-plan-payment-status" data-aid={`pg_${paymentStatusData.id}`} >
        <Imgc
          src={require(`assets/${productName}/${paymentStatusData.icon}`)}
          className="fpps-icon"
        />
        <WVPageTitle>{paymentStatusData.title}</WVPageTitle>
        <WVPageSubtitle>{paymentStatusData.subtitle}</WVPageSubtitle>
        {paymentStatusData.isSuccess && (
          <>
            <div className="fpps-title" data-aid="grp_paymentSummary" >Payment summary</div>
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
