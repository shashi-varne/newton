import React from "react";
import PortfolioRedesign from "../portfolioLanding/PortfolioLanding";
import Api from "utils/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllocationDetails,
  getInvestments,
  getInvestmentSummary,
  getPortfolioStatusCode,
  getPortfolioSummary,
  getPortfolioSummaryData,
} from "businesslogic/dataStore/reducers/portfolioV2";
import SomethingsWrong from "../ErrorScreen/SomethingsWrong";
import InfoAction, {
  INFO_ACTION_VARIANT,
} from "../screens/InfoAction/InfoAction";
import { isEmpty } from "lodash-es";

const screen = "PortfolioLanding";

const PortfolioLandingContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const summaryData = getPortfolioSummaryData(state);
  const investmentSummary = getInvestmentSummary(state);
  const investments = getInvestments(state);
  const allocationDetails = getAllocationDetails(state);
  const statusCode = getPortfolioStatusCode(state);
  const assetWiseData = allocationDetails?.asset_allocation;
  const productWiseData = allocationDetails?.product_allocation;

  const init = () => {
    // if (isEmpty(summaryData)) {
    dispatch(getPortfolioSummary({ screen, Api }));
    // }
  };
  if (statusCode === 309) {
    return (
      <InfoAction
        title="No investments yet!"
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        kycDone={false}
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  }

  useEffect(() => {
    init();
  }, []);
  return (
    <WrappedComponent
      investmentSummary={investmentSummary}
      investments={investments}
      isInsuranceActive={summaryData?.is_insurance_invested}
      assetWiseData={assetWiseData}
      productWiseData={productWiseData}
      showTopSection={true}
      showAllocationSection={true}
      showErrorBox={false}
    />
  );
};

export default PortfolioLandingContainer(PortfolioRedesign);
