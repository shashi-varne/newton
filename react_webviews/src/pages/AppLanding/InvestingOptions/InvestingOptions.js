import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import { INVESTING_OPTIONS } from "businesslogic/strings/webappLanding";

import "./InvestingOptions.scss";

const InvestingOptions = ({
  investmentOptions,
  handleCardClick,
  sendEvents,
}) => {
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="investor-favourites-wrapper"
      dataAid={INVESTING_OPTIONS.dataAid}
      headerProps={{
        dataAid: INVESTING_OPTIONS.dataAid,
        rightIconSrc: require("assets/search_diy.svg"),
        headerTitle: INVESTING_OPTIONS.title,
        hideInPageTitle: true,
        showCloseIcon: true,
      }}
      eventData={sendEvents("just_set_events")}
    >
      <InvestmentOptions
        productList={investmentOptions}
        onClick={handleCardClick}
      />
    </Container>
  );
};

export default InvestingOptions;
