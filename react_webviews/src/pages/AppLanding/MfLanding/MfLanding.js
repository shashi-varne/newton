import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";
import {
  EXPLORE_CATEGORIES,
  INVESTMENT_OPTIONS,
  kycData,
  MARKETING_BANNERS,
} from "../common/constants";

import "./MfLanding.scss";

const MfLanding = ({ showMarketingBanners = true, showKycCard = false }) => {
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="mf-landing-wrapper"
      dataAid="onboarding"
      headerProps={{
        dataAid: 1,
        rightIconSrc: require("assets/search_diy.svg"),
        headerTitle: "Mutual Funds",
        hideInPageTitle: true,
      }}
    >
      {showMarketingBanners && <MarketingBanners banners={MARKETING_BANNERS} />}
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
        productList={INVESTMENT_OPTIONS}
      />
      <ExploreCategories
        title="Explore by categories"
        titleDataAid="exploreCategories"
        categories={EXPLORE_CATEGORIES}
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
