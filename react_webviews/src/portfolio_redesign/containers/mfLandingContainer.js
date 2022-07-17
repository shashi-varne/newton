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
} from "businesslogic/dataStore/reducers/portfolioV2";
import InfoAction, {
  INFO_ACTION_VARIANT,
} from "../screens/InfoAction/InfoAction";
import SomethingsWrong from "../ErrorScreen/SomethingsWrong";
import { getExternalPortfolioData } from "businesslogic/constants/portfolio";
import { nativeCallback } from "../../utils/native_callback";

const screen = "MfLanding";

const MfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const mfSummary = getMfPortfolioSummaryData(state);
  const statusCode = 200; //TODO: getPortfolioStatusCode(state);
  const externalPfData = getExternalPortfolioDetails(state);
  const externalPfStatus = externalPfData?.status || "init";
  const externalPfCardData = getExternalPortfolioData(externalPfStatus);
  const eventRef = useRef({
    screen_name: "mutual funds",
    user_action: "back",
    card_click: "",
    current_investment: "no",
    view_details: "no",
    user_application_status: "init",
    user_investment_status: "false",
    user_kyc_status: "false",
  });
  const goToAssetAllocation = () => {
    sendEvents("view_details", "yes", "next");
    navigate("/portfolio/asset-allocation");
  };
  const init = () => {
    dispatch(getMfPortfolioSummary({ screen, Api }));
  };
  useEffect(() => {
    init();
  }, []);

  const sendEvents = (eventKey, eventVal, userAction = "back") => {
    const eventObj = {
      event_name: "mf_portfolio",
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

  const handleEasySip = () => {
    sendEvents("card_click", "set up easysip", "next");
    //TODO: goto EasySip
  };

  const handleExternalPortfolio = () => {
    sendEvents("card_click", "import external portfolio", "next");
    //TODO: goto
  };

  const handleInvestInMf = () => {
    sendEvents("card_click", "invest in mutual funds", "next");
  };

  const handleOption = (option) => {
    sendEvents("card_click", option?.title?.toLowerCase(), "next");
  };

  if (statusCode === 311) {
    return (
      <InfoAction
        dataAidSuffix={"updatingShortly"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"START INVESTING"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  } else if (statusCode === 318 || statusCode === 317) {
    return <SomethingsWrong onClickCta={init} />;
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
