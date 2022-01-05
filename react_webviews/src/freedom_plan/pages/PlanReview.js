import React, { useMemo, useState } from "react";
import Container from "../common/Container";
import ClickableText from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import Tile from "../mini-components/Tile";
import { getPlanReviewData, KYC_STATUS_MAPPER } from "../common/constants";
import "./PlanReview.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import SelectFreedomPlan from "../mini-components/SelectFreedomPlan";
import TermsAndConditions from "../mini-components/TermsAndConditions";

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
  const [openSelectPlan, setOpenSelectPlan] = useState(false);
  const [openTermsAndConditions, setOpenTermsAnsConditions] = useState(false);
  const [plan, setPlan] = useState(6);

  const sendEvents = (userAction, isSelectPlan, changePlan = "no") => {
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: "review_plan",
        plan_selected: `${data.months}_months`,
        change_plan_clicked: changePlan,
      },
    };
    if (isSelectPlan) {
      eventObj.properties.screen_name = "select_plan";
      eventObj.properties.plan_selected = `${plan}_months`;
    }
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
    sendEvents("next", false, "yes");
    setOpenSelectPlan(true);
  };

  const handleKycStatusBottomsheet = () => {
    sendEvents("next");
  };

  const closeSelectFreedomPlan = () => {
    sendEvents("back", true);
    setOpenSelectPlan(false);
  };

  const handleSelectPlan = (value) => {
    setPlan(value);
    sendEvents("next", true);
    setOpenSelectPlan(false);
  };

  const handleTermsAndConditions = (value) => () => {
    setOpenTermsAnsConditions(value);
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
          <span onClick={handleTermsAndConditions(true)}>
            Terms & Conditions
          </span>{" "}
          of Use for the Freedom plan
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
          onClick: handleKycStatusBottomsheet,
        }}
      />
      <SelectFreedomPlan
        selectedPlan={plan}
        isOpen={openSelectPlan}
        onClose={closeSelectFreedomPlan}
        onClick={handleSelectPlan}
      />
      <TermsAndConditions
        isOpen={openTermsAndConditions}
        close={handleTermsAndConditions(false)}
      />
    </Container>
  );
};

export default PlanReview;
