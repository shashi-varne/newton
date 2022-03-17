import React, { useEffect, useMemo, useState } from "react";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import Container from "../../common/Container";
import { Imgc } from "../../../common/ui/Imgc";
import Toast from "../../../common/ui/Toast";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import { nativeCallback } from "../../../utils/native_callback";
import { getUserKycFromSummary } from "../../common/api";
import useUserKycHook from "../../common/hooks/userKycHook";
import {
  getAocPaymentSummaryData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";
import { PATHNAME_MAPPER } from "../../constants";

import "./PaymentStatus.scss";

const PaymentStatus = (props) => {
  const { productName, Web } = useMemo(getConfig, []);
  const navigate = navigateFunc.bind(props);
  const [paymentStatusData, setPaymentStatusData] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const { kyc, updateKyc } = useUserKycHook();
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const data =
      PAYMENT_STATUS_DATA[kyc?.equity_aoc_payment_status] ||
      PAYMENT_STATUS_DATA["failed"];
    setPaymentStatusData(data);
    if (data.isSuccess) {
      const aocPaymentDetails = getAocPaymentSummaryData();
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

  const handleClick = () => {
    sendEvents("home");
    if (Web) {
      navigate("/");
    } else {
      nativeCallback({ action: "exit_web" });
    }
  };

  const redirectToHome = () => {
    if (paymentStatusData.isSuccess) {
      navigate(PATHNAME_MAPPER.invest);
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
      data-aid="freedomPlanPaymentStatus"
    >
      <div
        className="freedom-plan-payment-status"
        data-aid={`pg_${paymentStatusData.id}`}
      >
        {!isEmpty(paymentStatusData) && (
          <Imgc
            src={require(`assets/${productName}/${paymentStatusData.icon}`)}
            className="fpps-icon"
          />
        )}
        <WVPageTitle>{paymentStatusData.title}</WVPageTitle>
        <WVPageSubtitle>{paymentStatusData.subtitle}</WVPageSubtitle>
        {paymentStatusData.isSuccess && !isEmpty(paymentDetails) && (
          <>
            <div className="fpps-title" data-aid="grp_paymentSummary">
              {paymentDetails.title}
            </div>
            {paymentDetails.data.map((el, index) => (
              <Tile key={index} {...el} />
            ))}
          </>
        )}
      </div>
    </Container>
  );
};

export default PaymentStatus;

const Tile = ({ title, amount, className, dataAid, showDivider }) => (
  <div>
    <div>{title}</div>
    <div>{amount}</div>
  </div>
);
