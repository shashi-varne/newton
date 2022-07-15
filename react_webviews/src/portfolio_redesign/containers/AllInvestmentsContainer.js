import {
  getInvestments,
  getInvestmentSummary,
  getPortfolioSummaryData,
} from "businesslogic/dataStore/reducers/portfolioV2";
import React from "react";
import { useSelector } from "react-redux";
import AllInvestments from "../AllInvestments/AllInvestments";
import { navigate as navigateFunc } from "utils/functions";

const AllInvestmentsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const state = useSelector((state) => state);
  const investments = getInvestments(state);
  const investmentSummary = getInvestmentSummary(state);
  const handleCardClick = (type) => {
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
  return (
    <WrappedComponent
      investments={investments}
      handleCardClick={handleCardClick}
      investmentSummary={investmentSummary}
    />
  );
};

export default AllInvestmentsContainer(AllInvestments);
