import {
  getInvestments,
  getInvestmentSummary,
} from "businesslogic/dataStore/reducers/portfolioV2";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import AllInvestments from "../AllInvestments/AllInvestments";
import { navigate as navigateFunc } from "utils/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import { getConfig } from "../../utils/functions";

const AllInvestmentsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const state = useSelector((state) => state);
  const investments = getInvestments(state);
  const { user, kyc } = useUserKycHook();
  const investmentSummary = getInvestmentSummary(state);
  const eventRef = useRef({
    screen_name: "mutual funds",
    user_action: "back",
    card_click: "",
    user_application_status: kyc?.application_status_v2 || "init",
    user_investment_status: user?.active_investment,
    user_kyc_status: kyc?.mf_kyc_processed || false,
  });
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

  const handleCardClick = (card) => {
    sendEvents("card_click", card?.title?.toLowerCase(), "next");
    switch (card.type) {
      case "mf":
        navigate("/portfolio/mf-landing");
        break;
      case "nps":
        if (card?.no_active_investment) {
          props.history.push({
            pathname: "/portfolio/info-action",
            search: `${getConfig().searchParams}`,
            state: { noNpsInvestment: true },
          });
        } else {
          navigate("/nps/info");
        }
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
      sendEvents={sendEvents}
    />
  );
};

export default AllInvestmentsContainer(AllInvestments);
