import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";
import KycBottomsheet from "../../../featureComponent/appLanding/KycBottomsheet";
import { MF_LANDING } from "../../../strings/webappLanding";
import { isEmpty } from "lodash-es";

import "./MfLanding.scss";

const MfLanding = ({
  sendEvents,
  onRightIconClick,
  handleKycPrimaryClick,
  handleKycSecondaryClick,
  bottomsheetStates,
  kycBottomsheetData,
  closeKycBottomsheet,
  isPageLoading,
  ...restProps
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
        headerTitle: MF_LANDING.title.value,
        hideInPageTitle: true,
        onRightIconClick,
      }}
      eventData={sendEvents("just_set_events")}
      isPageLoading={isPageLoading}
    >
      {renderCards({
        ...restProps,
      })}
      <TrustIcon
        dataAid="1"
        variant="registration"
        className="mfl-trust-icon"
      />
      <Partnership className="mfl-partnership" />
      {bottomsheetStates.openKycStatusDialog &&
        !isEmpty(kycBottomsheetData) && (
          <KycBottomsheet
            isOpen={bottomsheetStates.openKycStatusDialog}
            onClose={closeKycBottomsheet}
            dataAid="kyc"
            data={kycBottomsheetData}
            onPrimaryClick={handleKycPrimaryClick}
            onSecondaryClick={handleKycSecondaryClick}
          />
        )}
    </Container>
  );
};

export default MfLanding;

const renderCards = ({
  showMarketingBanners,
  showKycCard,
  kycData,
  marketingBanners,
  investmentOptions,
  exploreCategories,
  handleKyc,
  handleCardClick,
  handleExploreCategories,
  onMarketingBannerClick,
  mfSections,
}) => {
  const cardsMapper = {
    marketingBanners: (
      <>
        {showMarketingBanners && (
          <MarketingBanners
            onClick={onMarketingBannerClick}
            banners={marketingBanners}
          />
        )}
      </>
    ),
    kyc: (
      <>
        {showKycCard && (
          <CardHorizontal
            rightImgSrc={require(`assets/fisdom/${kycData.icon}`)}
            title={kycData.title}
            description={kycData.subtitle}
            descriptionColor={kycData.descriptionColor}
            actionLink={kycData.buttonTitle}
            className="mfl-kyc"
            variant="heroCard"
            buttonProps={{
              isInverted: false,
            }}
            sx={{
              background: "white !important",
            }}
            dataAid={MF_LANDING.kycDataAid}
            titleColor="foundationColors.content.primary"
            onClick={handleKyc(kycData.eventStatus)}
          />
        )}
      </>
    ),
    mfOptions: (
      <InvestmentOptions
        titleDataAid={MF_LANDING.investmentOptions.dataAid}
        title={MF_LANDING.investmentOptions.title}
        productList={investmentOptions}
        onClick={handleCardClick}
      />
    ),
    exploreCategories: (
      <ExploreCategories
        titleDataAid={MF_LANDING.exploreCategories.dataAid}
        title={MF_LANDING.exploreCategories.title}
        categories={exploreCategories}
        onClick={handleExploreCategories}
      />
    ),
  };
  return (
    <>
      {mfSections.map((el, index) => {
        return <React.Fragment key={index}>{cardsMapper[el]}</React.Fragment>;
      })}
    </>
  );
};
