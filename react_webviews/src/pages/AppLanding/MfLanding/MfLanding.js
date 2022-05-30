import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";
import { MF_LANDING } from "businesslogic/strings/webappLanding";

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
      dataAid={MF_LANDING.title.dataAid}
      headerProps={{
        dataAid: MF_LANDING.title.value,
        rightIconSrc: require("assets/search_diy.svg"),
        headerTitle: MF_LANDING.title.dataAid,
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
          dataAid={MF_LANDING.kycDataAid}
        />
      )}
      <InvestmentOptions
        titleDataAid={MF_LANDING.investmentOptions.dataAid}
        title={MF_LANDING.investmentOptions.title}
        productList={investmentOptions}
      />
      <ExploreCategories
        titleDataAid={MF_LANDING.exploreCategories.dataAid}
        title={MF_LANDING.exploreCategories.title}
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
