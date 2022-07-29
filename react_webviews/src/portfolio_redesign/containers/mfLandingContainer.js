import {
  getExternalPortfolioData,
  MF_PORTFOLIO_LANDING_STATUS_CODE,
} from "businesslogic/constants/portfolio";
import {
  getExternalPortfolioDetails,
  getMfAssetAllocation,
  getMfPortfolioErrorMessage,
  getMfPortfolioSummary,
  getMfPortfolioSummaryData,
  getPortfolioStatusCode,
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
import MFLanding from "../mutualFund/MFLanding";
import InfoAction, {
  INFO_ACTION_VARIANT,
} from "../screens/InfoAction/InfoAction";

const screen = "MfLanding";

const MfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const assetAllocationData = useSelector((state) =>
    getMfAssetAllocation(state)
  );
  const graphData = assetAllocationData.categories;
  const mfSummary = useSelector((state) => getMfPortfolioSummaryData(state));
  const statusCode = useSelector((state) => getPortfolioStatusCode(state));
  const { isPageLoading } = useLoadingState(screen);
  const { kyc, user } = useUserKycHook();
  const externalPfData = useSelector((state) =>
    getExternalPortfolioDetails(state)
  );
  const showMfWalkthrough = useSelector(
    (state) => state?.portfolioV2?.mfWalkthroughInitiated
  );
  const error = useSelector((state) => getMfPortfolioErrorMessage(state));
  const [viewData, setViewData] = useState({
    showTopSection: true,
    showErrorBox: false,
    errorVariant: "",
  });

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

  const checkErrorStatusCode = () => {
    if (
      statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.mfExternalPortfolioFailed
    ) {
      setViewData({
        showErrorBox: true,
        showTopSection: false,
        errorMessage: error || "Unable to load your external portfolio",
        errorVariant: ERROR_STATE_BOX_VARIANTS.NO_EXTERNAL_PORTFOLIO,
      });
    }
  };

  const goToAssetAllocation = () => {
    sendEvents("view_details", "yes", "next");
    navigate("/portfolio/asset-allocation");
  };
  const init = () => {
    dispatch(getMfPortfolioSummary({ screen, Api }));
  };
  useEffect(() => {
    if (isEmpty(mfSummary)) {
      init();
    }
    if (
      statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.mfExternalPortfolioFailed
    ) {
      checkErrorStatusCode();
    }
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

  const goToKyc = () => {
    navigate("/kyc/web");
  };

  const goToInvest = () => {
    navigate("/");
  };

  const handleMissedSip = () => {
    console.log("missed sip");
  };

  if (statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.kycPending) {
    return (
      <InfoAction
        pageTitle="Mutual funds"
        eventName={"main_portfolio"}
        screenName="no active investments"
        dataAidSuffix={"noInvestments"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"START KYC"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat!"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
        onClickCta={goToKyc}
        pageDataAid="mutualFundPortfolioEmptyKYC"
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
        onClickCta={() => {}} //TODO: add redirection after orders page is developed
        pageDataAid="mutualFundPortfolioUpdating"
      />
    );
  } else if (statusCode === MF_PORTFOLIO_LANDING_STATUS_CODE.noInvestment) {
    return (
      <InfoAction
        pageTitle="Mutual funds"
        screenName="no active investments"
        eventName={"main_portfolio"}
        dataAidSuffix={"updatingShortly"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"INVEST NOW"}
        handleExternalPortfolio={handleExternalPortfolio}
        summaryData={externalPfData?.data}
        externalPfData={externalPfCardData}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat!"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
        onClickCta={goToInvest}
        pageDataAid="mutualFundPortfolioEmptyKYC"
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
        handleExternalPortfolio={handleExternalPortfolio}
        summaryData={externalPfData?.data}
        externalPfData={externalPfCardData}
        isRedeemUser={true}
        handleOption={handleOption}
        subtitle="It seems you’ve redeemed all your mutual fund investments due to which you’re not able to view them here"
        ctaTitle={"INVEST AGAIN"}
        variant={INFO_ACTION_VARIANT.WITHOUT_ACTION}
        onClickCta={goToInvest}
        pageDataAid="mutualFundPortfolioAfterRedeem"
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
      externalPfSummary={externalPfData}
      sendEvents={sendEvents}
      handleOption={handleOption}
      showMfWalkthrough={showMfWalkthrough}
      graphData={graphData}
      onClickRefresh={init}
      showErrorBox={viewData?.showErrorBox}
      errorMessage={viewData?.errorMessage}
      errorStateVariant={viewData?.errorVariant}
      navigate={navigate}
    />
  );
};

export default MfLandingContainer(MFLanding);
