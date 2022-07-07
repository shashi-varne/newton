import React from "react";
import PortfolioRedesign from "../portfolioLanding/PortfolioLanding";
import Api from "utils/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllocationDetails,
  getInvestmentSummary,
  getPortfolioSummary,
  getPortfolioSummaryData,
} from "businesslogic/dataStore/reducers/portfolioV2";

const screen = "PortfolioLanding";

const PortfolioLandingContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const summaryData = getPortfolioSummaryData(state);
  const investmentSummary = getInvestmentSummary(state);
  const allocationDetails = getAllocationDetails(state);
  const assetWiseData = allocationDetails?.asset_allocation;
  const productWiseData = allocationDetails?.product_allocation;

  useEffect(() => {
    dispatch(getPortfolioSummary({ screen, Api }));
  }, []);
  return (
    <WrappedComponent
      investmentSummary={investmentSummary}
      isInsuranceActive={summaryData?.is_insurance_invested}
      assetWiseData={assetWiseData}
      productWiseData={productWiseData}
    />
  );
};

export default PortfolioLandingContainer(PortfolioRedesign);
