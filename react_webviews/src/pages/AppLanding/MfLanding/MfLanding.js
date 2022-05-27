import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";

import "./MfLanding.scss";

const MfLanding = ({
  showMarketingBanners,
  showKycCard,
  kycData,
  marketingBanners,
  investmentOptions,
  exploreCategories,
}) => {
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="mf-landing-wrapper"
      dataAid="mutualFunds"
      headerProps={{
        dataAid: "mutualFunds",
        rightIconSrc: require("assets/search_diy.svg"),
        headerTitle: "Mutual Funds",
        hideInPageTitle: true,
      }}
    >
      {showMarketingBanners && <MarketingBanners banners={marketingBanners} />}
      {showKycCard && (
        <CardHorizontal
          rightImgSrc={kycData.imgSrc}
          title={kycData.title}
          description={kycData.subtitle}
          actionLink={kycData.buttonTitle}
          className="mfl-kyc"
        />
      )}
      <InvestmentOptions
        titleDataAid="InvestorFavourites"
        title="Investors’ favourites"
        productList={investmentOptions}
      />
      <ExploreCategories
        title="Explore by categories"
        titleDataAid="exploreCategories"
        categories={exploreCategories}
      />
      <TrustIcon
        dataAid="1"
        variant="registration"
        className="mfl-trust-icon"
      />
      <Partnership className="mfl-partnership" />
    </Container>
  );
};

export default MfLanding;
