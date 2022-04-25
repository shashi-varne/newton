import React, { useEffect, useMemo, useState } from "react";
import Container from "../../common/Container";
import { Imgc } from "../../../common/ui/Imgc";
import WVPageTitle from "../../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
import { Tile } from "../mini-components/Tile";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import {
  handleNativeExit,
  nativeCallback,
} from "../../../utils/native_callback";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { checkPaymentStatus } from "../../common/api";
import useUserKycHook from "../../common/hooks/userKycHook";
import {
  AOC_STORAGE_CONSTANTS,
  getAocPaymentStatusData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";
import { getUrlParams, storageService } from "../../../utils/validators";
import {
  getAocData,
  triggerAocPayment,
  validateAocPaymentAndRedirect,
} from "../common/functions";
import { getAccountSummary } from "../../services";

import "./PaymentStatus.scss";
import ConfirmBackDialog from "../../mini-components/ConfirmBackDialog";

const initializePaymentStatusData = () => {
  const { status, message = "" } = getUrlParams();
  return {
    config: getConfig(),
    aocPaymentData: storageService().getObject(
      AOC_STORAGE_CONSTANTS.AOC_PAYMENT_DATA
    ),
    status,
    message,
  };
};

const PaymentStatus = (props) => {
  const navigate = navigateFunc.bind(props);
  const { config, aocPaymentData, status, message } = useMemo(
    initializePaymentStatusData,
    []
  );
  const [paymentStatusData, setPaymentStatusData] = useState({});
  const [showSkelton, setShowSkelton] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [errorData, setErrorData] = useState({});
  const [count, setCount] = useState(30);
  const [countdownInterval, setCountdownInterval] = useState();
  const { kyc, updateKyc } = useUserKycHook();
  const [openConfirmBackModal, setOpenConfirmBackModal] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    if (status === "success") {
      await fetchKyc();
      setAocPaymentStatusData(status);
    } else if (status === "failed") {
      setAocPaymentStatusData(status);
    } else {
      if (isEmpty(aocPaymentData)) {
        setAocPaymentStatusData("failed");
        return;
      }
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

  const fetchKyc = async () => {
    try {
      setShowSkelton(true);
      setErrorData({});
      const result = await getAccountSummary({
        user: ["user"],
        kyc: ["kyc"],
      });
      let userKyc = get(result, "data.kyc.kyc.data", {});
      if (!isEmpty(userKyc)) {
        updateKyc(userKyc);
      }
    } catch (err) {
      setErrorData({
        showError: "page",
        title2: err.message,
        handleClick1: fetchKyc,
      });
    } finally {
      setShowSkelton(false);
    }
  };

  const setAocPaymentStatusData = (paymentStatus) => {
    const data = PAYMENT_STATUS_DATA[paymentStatus] || PAYMENT_STATUS_DATA["failed"];
    if (!data.isSuccess && !isEmpty(message)) {
      data.subtitle = decodeURIComponent(message);
    }
    setPaymentStatusData(data);
    if (data.isSuccess) {
      const aocData = getAocData(kyc);
      const aocPaymentDetails = getAocPaymentStatusData(aocData);
      setPaymentDetails(aocPaymentDetails);
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: paymentStatusData.screenName,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const checkAocPaymentStatus = async (refund = false) => {
    try {
      const result = await checkPaymentStatus({
        paymentId: aocPaymentData.id,
        pptId: aocPaymentData.ppt_id,
        refund,
      });
      if (result.status === "success" || refund) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
        setAocPaymentStatusData(result.status);
        setShowLoader(false);
        if (!isEmpty(result.kyc)) {
          updateKyc(result.kyc);
        }
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
    sendEvents("next");
    if (paymentStatusData.isSuccess) {
      validateAocPaymentAndRedirect(kyc, navigate);
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
    sendEvents("back");
    handleNativeExit(props, { action: "exit" });
  };

  const handleGoBack = () => {
    if (showLoader || showSkelton) {
      return;
    }
    if(paymentStatusData.isSuccess){
      redirectToHome();
    }else{
      setOpenConfirmBackModal(true);
    }
  }

  const closeConfirmBackModal= () => {
    setOpenConfirmBackModal(false);
  }

  return (
    <Container
      headerData={{
        icon: "close",
        goBack: handleGoBack,
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
      loaderData={{
        loadingText: "Please wait while your payment is being processed",
      }}
      noFooter={showLoader === "page"}
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
      <ConfirmBackDialog
        isOpen={openConfirmBackModal}
        close = {closeConfirmBackModal}
        goBack={redirectToHome}
        enableBackDrop={true}
      />
    </Container>
  );
};

export default PaymentStatus;
