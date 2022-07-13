import React, { useState } from "react";
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
import { ERROR_STATE_BOX_VARIANTS } from "../ErrorScreen/ErrorStateBox";

const screen = "PortfolioLanding";

const PortfolioLandingContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const summaryData = getPortfolioSummaryData(state);
  const investmentSummary = getInvestmentSummary(state);
  const investments = getInvestments(state);
  const allocationDetails = getAllocationDetails(state);
  const statusCode = 314; //TODO: getPortfolioStatusCode(state);
  const assetWiseData = allocationDetails?.asset_allocation;
  const productWiseData = allocationDetails?.product_allocation;
  const [viewData, setViewData] = useState({
    showTopSection: true,
    showAllocationSection: true,
    showErrorBox: false,
    errorVariant: "",
  });

  useEffect(() => {
    init();
    if (statusCode === 313 || 315) {
      checkErrorStatusCode();
    }
  }, [statusCode]);

  const init = () => {
    if (isEmpty(summaryData)) {
      dispatch(getPortfolioSummary({ screen, Api }));
    }
  };

  const checkErrorStatusCode = () => {
    console.log("status", statusCode);
    if (!statusCode) return;
    if (statusCode === 313) {
      setViewData({
        showErrorBox: true,
        showTopSection: false,
        showAllocationSection: false,
        errorVariant: ERROR_STATE_BOX_VARIANTS.DOWNTIME,
      });
    } else if (statusCode === 315) {
      setViewData({
        showErrorBox: true,
        showTopSection: false,
        showAllocationSection: false,
        errorVariant: ERROR_STATE_BOX_VARIANTS.NO_INVESTMENT,
      });
    }
  };
  if (statusCode === 308) {
    return (
      <InfoAction
        dataAidSuffix={"updatingShortly"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"START KYC"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  } else if (statusCode === 310) {
    return (
      <InfoAction
        dataAidSuffix={"noInvestment"}
        topImgSrc={require("assets/portfolio_no_investment.svg")}
        title="No investments yet!"
        ctaTitle={"INVEST NOW"}
        subtitle="Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat! Calculate Returns"
        variant={INFO_ACTION_VARIANT.WITH_ACTION}
      />
    );
  } else if (statusCode === 312) {
    return (
      <InfoAction
        dataAidSuffix={"noInvestments"}
        topImgSrc={require("assets/updating_shortly.svg")}
        title="Updating shortly..."
        subtitle="Your investments will start to appear here in a while"
        ctaTitle={"VIEW ORDERS"}
        variant={INFO_ACTION_VARIANT.WITHOUT_ACTION}
      />
    );
  }
  if (statusCode === 314) {
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
    />
  );
};

export default PortfolioLandingContainer(PortfolioRedesign);
