import {
  getAllocationDetails,
  getInvestments,
  getInvestmentSummary,
  getPortfolioSummary,
  getPortfolioSummaryData,
} from "businesslogic/dataStore/reducers/portfolioV2";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Api from "utils/api";
import { navigate as navigateFunc } from "utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { ERROR_STATE_BOX_VARIANTS } from "../ErrorScreen/ErrorStateBox";
import SomethingsWrong from "../ErrorScreen/SomethingsWrong";
import PortfolioRedesign from "../portfolioLanding/PortfolioLanding";
import InfoAction, {
  INFO_ACTION_VARIANT,
} from "../screens/InfoAction/InfoAction";

const screen = "PortfolioLanding";

const PortfolioLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const summaryData = getPortfolioSummaryData(state);
  const investmentSummary = getInvestmentSummary(state);
  const investments = getInvestments(state);
  const allocationDetails = getAllocationDetails(state);
  const statusCode = 200; //TODO: getPortfolioStatusCode(state);
  const assetWiseData = allocationDetails?.asset_allocation;
  const productWiseData = allocationDetails?.product_allocation;
  const eventRef = useRef({
    user_action: "back",
    card_click: "",
    investments_summary: "",
    realised_gain: "",
    view_all_investments: "",
    allocations: "",
    user_application_status: "",
    user_investment_status: "",
    user_kyc_status: "",
  });
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
    // if (isEmpty(summaryData)) {
    dispatch(getPortfolioSummary({ screen, Api }));
    // }
  };

  const sendEvents = (userAction = "back") => {
    const eventObj = {
      event_name: "main_portfolio",
      properties: {
        user_action: userAction,
        card_click: "",
        investments_summary: "",
        realised_gain: "",
        view_all_investments: "",
        allocations: "",
        user_application_status: "",
        user_investment_status: "",
        user_kyc_status: "",
      },
    };
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };

  const checkErrorStatusCode = () => {
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

  const handleFeatureCard = (type) => {
    switch (type) {
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
    navigate("/portfolio/all-investments");
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
      handleFeatureCard={handleFeatureCard}
      onClickViewAll={onClickViewAll}
    />
  );
};

export default PortfolioLandingContainer(PortfolioRedesign);
