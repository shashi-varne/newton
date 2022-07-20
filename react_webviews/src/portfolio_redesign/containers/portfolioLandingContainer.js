import {
  getAllocationDetails,
  getInvestments,
  getInvestmentSummary,
  getPortfolioStatusCode,
  getPortfolioSummary,
  getPortfolioSummaryData,
} from "businesslogic/dataStore/reducers/portfolioV2";
import { isEmpty } from "lodash-es";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Api from "utils/api";
import { navigate as navigateFunc } from "utils/functions";
import useLoadingState from "../../common/customHooks/useLoadingState";
import UiSkelton from "../../common/ui/Skelton";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import { ERROR_STATE_BOX_VARIANTS } from "../ErrorScreen/ErrorStateBox";
import SomethingsWrong from "../ErrorScreen/SomethingsWrong";
import PortfolioRedesign from "../portfolioLanding/PortfolioLanding";
import InfoAction, {
  INFO_ACTION_VARIANT,
} from "../screens/InfoAction/InfoAction";
import { PORTFOLIO_LANDING_STATUS_CODES } from "businesslogic/constants/portfolio";
import { getConfig } from "../../utils/functions";

const screen = "PortfolioLanding";

const PortfolioLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const summaryData = getPortfolioSummaryData(state);
  const investmentSummary = getInvestmentSummary(state);
  const investments = getInvestments(state);
  const { kyc, isLoading, user } = useUserKycHook();
  const { isPageLoading } = useLoadingState(screen);
  const allocationDetails = getAllocationDetails(state);
  const statusCode = getPortfolioStatusCode(state);
  const assetWiseData = allocationDetails?.asset_allocation;
  const productWiseData = allocationDetails?.product_allocation;
  const eventRef = useRef({
    screen_name: "portfolio",
    user_action: "back",
    card_click: "",
    investments_summary: "no",
    realised_gain: "no",
    view_all_investments: "no",
    allocations: "asset-wise",
    user_application_status: kyc?.application_status_v2 || "init",
    user_investment_status: user?.active_investment,
    user_kyc_status: kyc?.mf_kyc_processed || false,
  });
  const [viewData, setViewData] = useState({
    showTopSection: true,
    showAllocationSection: true,
    showErrorBox: false,
    errorVariant: "",
  });
  const checkIfOnlyMf = () => {
    if (isEmpty(getConfig().features)) {
      navigate("/portfolio/mf-landing");
    }
  };
  useEffect(() => {
    checkIfOnlyMf();
    init();
    if (
      statusCode === PORTFOLIO_LANDING_STATUS_CODES.downtime ||
      PORTFOLIO_LANDING_STATUS_CODES.stocksFailed
    ) {
      checkErrorStatusCode();
    }
  }, [statusCode]);

  const init = () => {
    if (isEmpty(summaryData)) {
      dispatch(getPortfolioSummary({ screen, Api }));
    }
  };

  const sendEvents = (eventKey, eventVal, userAction = "back") => {
    const eventObj = {
      event_name: "main_portfolio",
      properties: eventRef.current,
    };
    const properties = {
      ...eventObj.properties,
      [eventKey]: eventVal,
      userAction,
    };
    eventObj.properties = properties;
    eventRef.current = properties;
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };

  const checkErrorStatusCode = () => {
    if (!statusCode) return;
    if (statusCode === PORTFOLIO_LANDING_STATUS_CODES.downtime) {
      setViewData({
        showErrorBox: true,
        showTopSection: false,
        showAllocationSection: false,
        errorVariant: ERROR_STATE_BOX_VARIANTS.DOWNTIME,
      });
    } else if (statusCode === PORTFOLIO_LANDING_STATUS_CODES.stocksFailed) {
      setViewData({
        showErrorBox: true,
        showTopSection: false,
        showAllocationSection: false,
        errorVariant: ERROR_STATE_BOX_VARIANTS.NO_INVESTMENT,
      });
    }
  };

  const handleFeatureCard = (item) => {
    sendEvents("card_click", item.title?.toLowerCase(), "next");
    switch (item?.type) {
      case "mf":
        navigate("/portfolio/mf-landing");
        break;
      case "nps": //TODO:
        break;
      case "equity": //TODO:
        break;
      default:
        return;
    }
  };
  const onClickViewAll = () => {
    sendEvents("view_all_investments", "yes", "next");
    navigate("/portfolio/all-investments");
  };

  const handleInvestInMf = () => {
    sendEvents("card_click", "invest in mutual funds", "next");
    navigate("/invest/explore-v2");
  };

  const handleInsurance = () => {
    sendEvents("card_click", "insurance", "next");
    navigate("/group-insurance");
  };

  if (isPageLoading) {
    return <UiSkelton type="g" />;
  }
  if (statusCode === PORTFOLIO_LANDING_STATUS_CODES.kycPending) {
    return (
      <InfoAction
        pageTitle="Portfolio"
        eventName={"main_portfolio"}
        screenName=""
        dataAidSuffix={"noInvestments"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"START KYC"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  } else if (statusCode === PORTFOLIO_LANDING_STATUS_CODES.noInvestment) {
    return (
      <InfoAction
        pageTitle="Portfolio"
        eventName={"main_portfolio"}
        dataAidSuffix={"noInvestment"}
        screenName="no investments yet"
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"INVEST NOW"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  } else if (statusCode === PORTFOLIO_LANDING_STATUS_CODES.firstInvestment) {
    return (
      <InfoAction
        pageTitle="Portfolio"
        eventName={"main_portfolio"}
        screenName="updating shortly"
        dataAidSuffix={"updatingShortly"}
        topImgSrc={require("assets/updating_shortly.svg")}
        title="Updating shortly..."
        subtitle="Your investments will start to appear here in a while"
        ctaTitle={"VIEW ORDERS"}
        variant={INFO_ACTION_VARIANT.WITHOUT_ACTION}
      />
    );
  }
  if (statusCode === PORTFOLIO_LANDING_STATUS_CODES.mfFailed) {
    return <SomethingsWrong onClickCta={init} />;
  }

  return (
    <WrappedComponent
      investmentSummary={investmentSummary}
      investments={investments}
      isInsuranceActive={summaryData?.is_insurance_invested}
      assetWiseData={assetWiseData}
      productWiseData={productWiseData}
      showTopSection={viewData?.showTopSection}
      showAllocationSection={viewData?.showAllocationSection}
      showErrorBox={viewData?.showErrorBox}
      errorStateVariant={viewData?.errorVariant}
      handleFeatureCard={handleFeatureCard}
      handleInvestInMf={handleInvestInMf}
      onClickViewAll={onClickViewAll}
      handleInsurance={handleInsurance}
      sendEvents={sendEvents}
    />
  );
};

export default PortfolioLandingContainer(PortfolioRedesign);
