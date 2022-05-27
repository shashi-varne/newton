import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";

import "./InvestorFavorites.scss";

const InvestorFavorites = ({ investmentOptions }) => {
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="investor-favourites-wrapper"
      dataAid="investorsFavourites"
      headerProps={{
        dataAid: "investorsFavourites",
        rightIconSrc: require("assets/search_diy.svg"),
        headerTitle: "Investors’ favourites",
        hideInPageTitle: true,
        showCloseIcon: true,
      }}
    >
      <InvestmentOptions productList={investmentOptions} />
    </Container>
  );
};

export default InvestorFavorites;
