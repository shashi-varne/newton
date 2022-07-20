import React, { useRef } from "react";
import Api from "utils/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MFLanding from "../mutualFund/MFLanding";
import { navigate as navigateFunc } from "utils/functions";
import {
  getExternalPortfolioDetails,
  getMfPortfolioSummary,
  getMfPortfolioSummaryData,
  getPortfolioStatusCode,
} from "businesslogic/dataStore/reducers/portfolioV2";
import InfoAction, {
  INFO_ACTION_VARIANT,
} from "../screens/InfoAction/InfoAction";
import SomethingsWrong from "../ErrorScreen/SomethingsWrong";
import {
  getExternalPortfolioData,
  MF_PORTFOLIO_LANDING_STATUS_CODE,
} from "businesslogic/constants/portfolio";
import { nativeCallback } from "../../utils/native_callback";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import UiSkelton from "../../common/ui/Skelton";
import useLoadingState from "../../common/customHooks/useLoadingState";
import { isEmpty } from "lodash-es";

const screen = "MfLanding";

const MfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const mfSummary = getMfPortfolioSummaryData(state);
  const statusCode = getPortfolioStatusCode(state);
  const { isPageLoading } = useLoadingState(screen);
  const { kyc, isLoading, user } = useUserKycHook();
  const externalPfData = getExternalPortfolioDetails(state);
  const externalPfStatus = externalPfData?.status || "init";
  const externalPfCardData = getExternalPortfolioData(externalPfStatus);
  const eventRef = useRef({
    screen_name: "mutual funds",
    user_action: "back",
    card_click: "",
    current_investment: "no",
    view_details: "no",
    user_application_status: kyc?.application_status_v2 || "init",
    user_investment_status: user?.active_investment,
    user_kyc_status: kyc?.mf_kyc_processed || false,
  });
  const goToAssetAllocation = () => {
    sendEvents("view_details", "yes", "next");
    navigate("/portfolio/asset-allocation");
  };
  const init = () => {
    if (isEmpty(mfSummary)) {
      dispatch(getMfPortfolioSummary({ screen, Api }));
    }
  };
  useEffect(() => {
    init();
  }, []);

  const sendEvents = (eventKey, eventVal, userAction) => {
    const eventObj = {
      event_name: "mf_portfolio",
      properties: eventRef.current,
    };
    const properties = {
      ...eventObj.properties,
      [eventKey]: eventVal,
      user_action: userAction || "back",
    };
    eventObj.properties = properties;
    eventRef.current = properties;
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };

  const handleEasySip = () => {
    sendEvents("card_click", "set up easysip", "next");
    //TODO: goto EasySip
  };

  const handleExternalPortfolio = () => {
    sendEvents("card_click", "import external portfolio", "next");
    navigate("/hni/external_portfolio");
  };

  const handleInvestInMf = () => {
    sendEvents("card_click", "invest in mutual funds", "next");
    navigate("/invest/explore-v2");
  };

  const handleOption = (option) => {
    sendEvents("card_click", option?.title?.toLowerCase(), "next");
    if (!!option?.path) navigate(option.path);
  };

  if (statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.kycPending) {
    return (
      <InfoAction
        pageTitle="Mutual funds"
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
  } else if (statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.firstInvestment) {
    return (
      <InfoAction
        pageTitle="Mutual funds"
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
  } else if (statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.noInvestment) {
    return (
      <InfoAction
        pageTitle="Mutual funds"
        eventName={"main_portfolio"}
        dataAidSuffix={"updatingShortly"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"START INVESTING"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  } else if (
    statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.mfFailed ||
    statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.mfExternalPortfolioFailed
  ) {
    return <SomethingsWrong onClickCta={init} />;
  } else if (
    statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.investmentRedeemed
  ) {
    return (
      <InfoAction
        pageTitle="Mutual funds"
        disableInPageTitle={false}
        eventName={"main_portfolio"}
        screenName="no active investments"
        dataAidSuffix={"noInvestment"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No active investments"
        externalPfData={externalPfCardData}
        isRedeemUser={true}
        handleOption={handleOption}
        subtitle="It seems you’ve redeemed all your investments due to which you’re not able to view them here"
        ctaTitle={"INVEST AGAIN"}
        variant={INFO_ACTION_VARIANT.WITHOUT_ACTION}
      />
    );
  }

  if (isPageLoading) {
    return <UiSkelton type="g" />;
  }

  return (
    <WrappedComponent
      mfSummary={mfSummary}
      goToAssetAllocation={goToAssetAllocation}
      handleInvestInMf={handleInvestInMf}
      handleExternalPortfolio={handleExternalPortfolio}
      handleEasySip={handleEasySip}
      externalPfCardData={externalPfCardData}
      externalPfStatus={externalPfStatus}
      sendEvents={sendEvents}
      handleOption={handleOption}
    />
  );
};

export default MfLandingContainer(MFLanding);
