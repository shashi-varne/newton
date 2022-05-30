import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import { INVESTOR_FAVORITES } from "businesslogic/strings/webappLanding";

import "./InvestorFavorites.scss";

const InvestorFavorites = ({ investmentOptions }) => {
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="investor-favourites-wrapper"
      dataAid={INVESTOR_FAVORITES.dataAid}
      headerProps={{
        dataAid: INVESTOR_FAVORITES.dataAid,
        rightIconSrc: require("assets/search_diy.svg"),
        headerTitle: INVESTOR_FAVORITES.title,
        hideInPageTitle: true,
        showCloseIcon: true,
      }}
    >
      <InvestmentOptions productList={investmentOptions} />
    </Container>
  );
};

export default InvestorFavorites;
