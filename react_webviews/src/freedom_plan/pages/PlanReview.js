import React, { useMemo, useState } from "react";
import Container from "../common/Container";
import ClickableText from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { getPlanReviewData, KYC_STATUS_MAPPER } from "../common/constants";
import "./PlanReview.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";

const data = {
  amount: 5999,
  gstAmount: 1079.82,
  totalAmount: 7078.82,
  months: 6,
};

const PlanReview = (props) => {
  const planDetails = useMemo(getPlanReviewData(data), [data]);
  const { productName } = useMemo(getConfig, []);
  const [isOpen, setIsOpen] = useState(false);
  const kycStatusData = KYC_STATUS_MAPPER["init"];
  const { kyc, isLoading } = useUserKycHook();
  const navigate = navigateFunc.bind(props);

  const sendEvents = (userAction, changePlan = "no") => {
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: "review_plan",
        plan_selected: `${data.months}_months`,
        change_plan_clicked: changePlan,
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

  const changePlan = () => {
    sendEvents("next", "yes");
  };

  const onKycStatusClick = () => {
    sendEvents("next");
  };

  return (
    <Container
      buttonTitle="PAY NOW"
      skelton={isLoading}
      title="Review you plan details"
      handleClick={handleClick}
      data-aid="freedom-plan-landing"
      events={sendEvents("just_set_events")}
    >
      <div className="freedom-plan-review">
        <main>
          <div className="fpr-details flex-between-center">
            <div>
              <div className="fprd-title">Freedom plan</div>
              <div className="fprd-subtitle">{data.months} months</div>
            </div>
            <ClickableText onClick={changePlan}>CHANGE PLAN</ClickableText>
          </div>
          <div className="fpr-summary">
            <div className="fpr-title">Price break-up</div>
            {planDetails.map((details, index) => (
              <Tile key={index} {...details} />
            ))}
          </div>
        </main>
        <footer>
          By tapping ‘PAY NOW’ you agree to the{" "}
          <span>Terms & Conditions of Use</span> for the Freedom plan
        </footer>
      </div>
      <WVBottomSheet
        isOpen={isOpen}
        title={kycStatusData.title}
        subtitle={kycStatusData.subtitle}
        image={require(`assets/${productName}/${kycStatusData.icon}`)}
        button1Props={{
          title: kycStatusData.buttonTitle,
          variant: "contained",
          onClick: onKycStatusClick,
        }}
      />
    </Container>
  );
};

export default PlanReview;

const Tile = ({
  showTopDivider,
  title,
  amount,
  amountClassName,
  titleClassName,
}) => {
  return (
    <>
      {showTopDivider && <hr className="generic-hr" />}
      <div className="flex-between-center">
        <div className={titleClassName}>{title}</div>
        <div className={amountClassName}>{amount}</div>
      </div>
    </>
  );
};
