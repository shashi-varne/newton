import React, { useMemo } from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import WVPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import { getPaymentSummaryData } from "../common/constants";
import { nativeCallback } from "../../utils/native_callback";

const data = {
  amount: 5999,
  gstAmount: 1079.82,
  totalAmount: 7078.82,
  months: 6,
};

const PaymentSuccess = (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const paymentDetails = useMemo(getPaymentSummaryData(data), [data]);

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: "payment_success",
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
      buttonTitle="OKAY"
      title="Payment successful"
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="freedom-plan-payment-success"
    >
      <div className="freedom-plan-payment-success">
        <Imgc
          src={require(`assets/${productName}/pg_success.svg`)}
          className="fpps-icon"
        />
        <WVPageTitle>Payment successful</WVPageTitle>
        <WVPageSubtitle>
          Your freedom plan will be activated in 24 hours. Till then, standard
          brokerage shall apply
        </WVPageSubtitle>
        <div className="fpps-title">Payment summary</div>
        {paymentDetails.map((data, index) => (
          <Tile key={index} {...data} />
        ))}
      </div>
    </Container>
  );
};

export default PaymentSuccess;

const Tile = ({ title, amount, showBottomDivider, className = "" }) => {
  return (
    <>
      <div className={`flex-between-center fpps-tile ${className}`}>
        <div className="fpps-tile-text">{title}</div>
        <div>{amount}</div>
      </div>
      {showBottomDivider && <div className="generic-hr m-top-1x" />}
    </>
  );
};
