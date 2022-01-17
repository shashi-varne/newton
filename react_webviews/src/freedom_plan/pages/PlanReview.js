import React, { useEffect, useMemo, useState } from "react";
import Container from "../common/Container";
import ClickableText from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import {
  getConfig,
  isTradingEnabled,
  navigate as navigateFunc,
} from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import Tile from "../mini-components/Tile";
import {
  getPlanReviewData,
  KYC_STATUS_MAPPER,
  PATHNAME_MAPPER,
} from "../common/constants";
import "./PlanReview.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import SelectFreedomPlan from "../mini-components/SelectFreedomPlan";
import TermsAndConditions from "../mini-components/TermsAndConditions";
import useFreedomDataHook from "../common/freedomPlanHook";
import { getKycAppStatus } from "../../kyc/services";
import { isEquityCompleted } from "../../kyc/common/functions";
import isEmpty from "lodash/isEmpty";
import { handleExit, isNative } from "../common/functions";

const PlanReview = (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName, searchParams } = useMemo(getConfig, []);
  const { kyc, isLoading } = useUserKycHook();
  const [openKycStatusBottomsheet, setOpenKycBottomsheet] = useState(false);
  const [openSelectPlan, setOpenSelectPlan] = useState(false);
  const [openTermsAndConditions, setOpenTermsAnsConditions] = useState(false);
  const {
    showLoader,
    errorData,
    freedomPlanData,
    freedomPlanList,
    initiatePayment,
    updateFreedomPlanData,
  } = useFreedomDataHook();
  const planDetails = useMemo(getPlanReviewData(freedomPlanData), [
    freedomPlanData,
  ]);

  useEffect(() => {
    if (isEmpty(freedomPlanData)) {
      navigate(PATHNAME_MAPPER.landing);
    }
  }, []);

  useEffect(() => {
    if (errorData.showError && openSelectPlan) {
      handleSelectPlan(false)();
    }
  }, [errorData.showError]);

  const initializeKycData = () => {
    if (!isEmpty(kyc)) {
      let kycStatus = getKycAppStatus(kyc).status;
      const equityEnabled = isTradingEnabled(kyc);
      const kycInitStatus = ["ground"];
      const kycIncompleteStatus = [
        "ground_pan",
        "ground_premium",
        "ground_aadhaar",
        "upgraded_incomplete",
      ];
      const kycInProgressStatus = ["submitted", "verifying_trading_account"];
      if (kycInitStatus.includes(kycStatus)) {
        kycStatus = "init";
      } else if (
        kycIncompleteStatus.includes(kycStatus) ||
        (kycStatus === "complete" &&
          equityEnabled &&
          kyc.kyc_product_type !== "equity") // retro user condition
      ) {
        kycStatus = "incomplete";
      } else if (kycInProgressStatus.includes(kycStatus)) {
        kycStatus = "in_progress";
      }
      return {
        kycStatusData: KYC_STATUS_MAPPER[kycStatus] || {},
        isEquityReady: isEquityCompleted(),
        isEquityEnabled: equityEnabled,
        kycStatus,
      };
    }
    return {};
  };

  const {
    kycStatusData,
    isEquityReady,
    kycStatus,
    isEquityEnabled,
  } = useMemo(initializeKycData, [kyc]);

  const sendEvents = (userAction, isSelectPlan, changePlan = "no", duration) => {
    const months = (duration || freedomPlanData.duration)/30;
    let eventObj = {
      event_name: "freedom_plan",
      properties: {
        user_action: userAction,
        screen_name: "review_plan",
        plan_selected: `${months}_months`,
      },
    };
    if (isSelectPlan) {
      eventObj.properties.screen_name = "select_plan";
    } else {
      eventObj.properties.change_plan_clicked = changePlan;
      const kycCompleted = isEquityReady ? "yes" : "no";
      eventObj.properties.kyc_completed = kycCompleted;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {
    sendEvents("next");
    if (isEquityReady) {
      initiatePayment({
        ucc: kyc.ucc,
        amount: freedomPlanData.amount,
        gst: freedomPlanData.gst,
        total_amount: freedomPlanData.total_amount,
        plan_id: freedomPlanData.id,
      });
      return;
    }
    if (!isEmpty(kycStatusData)) {
      setOpenKycBottomsheet(true);
    } else {
      redirectToKyc();
    }
  };

  const redirectToKyc = () => {
    if (kycStatus === "in_progress") {
      handleExit(props);
      return;
    }
    const isNativeFlow = isNative();
    const pathname = isNativeFlow ? "/kyc/native" : "/kyc/web";
    const searchData = `${searchParams}${
      isNativeFlow && isEquityEnabled ? `&equityEnabled=true` : ``
    }`;
    navigate(pathname, { searchParams: searchData });
  };

  const changePlan = () => {
    sendEvents("next", false, "yes");
    setOpenSelectPlan(true);
  };

  const handleSelectPlan = (closeSelectPlan) => (plan) => {
    const userAction = closeSelectPlan ? "back" : "next";
    if (!closeSelectPlan) {
      updateFreedomPlanData(plan);
    }
    sendEvents(userAction, true, "no", plan?.duration);
    setOpenSelectPlan(false);
  };

  const handleTermsAndConditions = (value) => () => {
    setOpenTermsAnsConditions(value);
  };

  const goBack = () => {
    sendEvents("back");
    navigate(PATHNAME_MAPPER.landing);
  }

  return (
    <Container
      buttonTitle="PAY NOW"
      skelton={isLoading}
      showLoader={showLoader}
      errorData={errorData}
      showError={errorData.showError}
      title="Review you plan details"
      handleClick={handleClick}
      data-aid="freedom-plan-landing"
      events={sendEvents("just_set_events")}
      headerData={{ goBack }}
    >
      <div className="freedom-plan-review">
        <main>
          <div className="fpr-details flex-between-center">
            <div>
              <div className="fprd-title">Freedom plan</div>
              <div className="fprd-subtitle">{freedomPlanData.name}</div>
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
      {!isEmpty(kycStatusData) && (
        <WVBottomSheet
          isOpen={openKycStatusBottomsheet}
          title={kycStatusData.title}
          subtitle={kycStatusData.subtitle}
          image={require(`assets/${productName}/${kycStatusData.icon}`)}
          button1Props={{
            title: kycStatusData.buttonTitle,
            variant: "contained",
            onClick: redirectToKyc,
          }}
        />
      )}
      <SelectFreedomPlan
        isOpen={openSelectPlan}
        onClose={handleSelectPlan(true)}
        onClick={handleSelectPlan(false)}
        freedomPlanData={freedomPlanData}
        freedomPlanList={freedomPlanList}
        showLoader={showLoader}
      />
      <TermsAndConditions
        isOpen={openTermsAndConditions}
        close={handleTermsAndConditions(false)}
      />
    </Container>
  );
};

export default PlanReview;
