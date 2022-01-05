import React, { useMemo } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import WVPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import {
  getPaymentSummaryData,
  PAYMENT_STATUS_DATA,
} from "../common/constants";
import { nativeCallback } from "../../utils/native_callback";
import Tile from "../mini-components/Tile";
import { getUrlParams } from "../../utils/validators";
import "./PaymentStatus.scss";

const data = {
  amount: 5999,
  gstAmount: 1079.82,
  totalAmount: 7078.82,
  months: 6,
};

const PaymentSuccess = (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const { status } = getUrlParams();
  const paymentStatusData = PAYMENT_STATUS_DATA[status] || PAYMENT_STATUS_DATA["failed"];
  const paymentDetails = useMemo(getPaymentSummaryData(data), [data]);

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
    sendEvents("next");
  };

  return (
    <Container
      headerData={{
        icon: "close",
      }}
      hidePageTitle
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

export default PaymentSuccess;
