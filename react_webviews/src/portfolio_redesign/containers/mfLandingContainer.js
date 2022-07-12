import React from "react";
import Api from "utils/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MFLanding from "../mutualFund/MFLanding";
import { navigate as navigateFunc } from "utils/functions";
import {
  getMfPortfolioSummary,
  getMfPortfolioSummaryData,
} from "businesslogic/dataStore/reducers/portfolioV2";

const screen = "MfLanding";

const MfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const mfSummary = getMfPortfolioSummaryData(state);

  const goToAssetAllocation = () => {
    navigate("/portfolio/asset-allocation");
  };
  useEffect(() => {
    dispatch(getMfPortfolioSummary({ screen, Api }));
  }, []);
  return (
    <WrappedComponent
      mfSummary={mfSummary}
      goToAssetAllocation={goToAssetAllocation}
    />
  );
};

export default MfLandingContainer(MFLanding);
