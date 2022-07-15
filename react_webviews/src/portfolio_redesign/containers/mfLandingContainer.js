import React from "react";
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

const screen = "MfLanding";

const MfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const mfSummary = getMfPortfolioSummaryData(state);
  const statusCode = 200; //TODO: getPortfolioStatusCode(state);
  const externalPfData = getExternalPortfolioDetails(state);
  const externalPfStatus = externalPfData?.status;
  const externalPfCardData = getExternalPortfolioData(externalPfStatus);
  console.log("statusData", externalPfCardData);
  const goToAssetAllocation = () => {
    navigate("/portfolio/asset-allocation");
  };
  const init = () => {
    dispatch(getMfPortfolioSummary({ screen, Api }));
  };
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [statusCode]);

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
      externalPfCardData={externalPfCardData}
      externalPfStatus={externalPfStatus}
    />
  );
};

export default MfLandingContainer(MFLanding);
