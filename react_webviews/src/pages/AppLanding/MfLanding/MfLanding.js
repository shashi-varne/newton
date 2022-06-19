import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import Typography from "../../../designSystem/atoms/Typography";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";
import KycBottomsheet from "../../../featureComponent/appLanding/KycBottomsheet";
import { MF_LANDING } from "../../../strings/webappLanding";
import { FINANCIAL_TOOLS } from "../../../constants/webappLanding";
import TrendingFunds from "../../DIY/DiyLanding/TrendingFunds";
import { isEmpty } from "lodash-es";

import "./MfLanding.scss";

const passiveIndexFundsData = MF_LANDING.passiveIndexFunds;
const externalPortfolioData = MF_LANDING.externalPortfolio;
const MfLanding = ({
  sendEvents,
  onRightIconClick,
  handleKycPrimaryClick,
  handleKycSecondaryClick,
  bottomsheetStates,
  kycBottomsheetData,
  closeKycBottomsheet,
  isPageLoading,
  showPartnership,
  baseConfig,
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
        baseConfig,
      })}
      <TrustIcon
        dataAid={baseConfig.productName}
        variant="registration"
        className="mfl-trust-icon"
      />
      {showPartnership && <Partnership className="lmw-partnership" />}
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
  investOptionsData,
  exploreCategoriesData,
  handleKyc,
  handleCardClick,
  handleExploreCategories,
  onMarketingBannerClick,
  mfSections,
  showPassiveFunds,
  baseConfig,
  handleFundDetails,
  showExternalPortfolio,
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
            rightImgSrc={require(`assets/${baseConfig.productName}/${kycData.icon}`)}
            title={kycData.title}
            description={kycData.subtitle}
            descriptionColor={
              kycData.descriptionColor || "foundationColors.content.secondary"
            }
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
    passiveIndexFunds: (
      <>
        {showPassiveFunds && (
          <>
            <div className="mfl-kyc">
              <CardHorizontal
                rightImgSrc={require(`assets/${baseConfig.productName}/${passiveIndexFundsData.icon}`)}
                title={passiveIndexFundsData.title}
                subtitle={passiveIndexFundsData.subtitle}
                actionLink={passiveIndexFundsData.buttonTitle}
                variant="heroCard"
                dataAid={passiveIndexFundsData.dataAid}
                footerText={passiveIndexFundsData.footerText}
                onClick={handleCardClick(passiveIndexFundsData)}
              />
              <Typography
                variant="body6"
                dataAid="helperText"
                color="foundationColors.content.secondary"
              >
                *Based on TER averages of regular large cap and direct index
                funds
              </Typography>
            </div>
          </>
        )}
      </>
    ),
    mfOptions: (
      <InvestmentOptions
        titleDataAid={investOptionsData.dataAid}
        title={investOptionsData.title}
        productList={investOptionsData.options}
        onClick={handleCardClick}
      />
    ),
    exploreCategories: (
      <ExploreCategories
        titleDataAid={exploreCategoriesData.dataAid}
        title={exploreCategoriesData.title}
        categories={exploreCategoriesData.options}
        onClick={handleExploreCategories}
        className={exploreCategoriesData.className}
        buttonData={baseConfig.isMobileDevice &&  exploreCategoriesData.buttonData}
      />
    ),
    financialTools: (
      <ExploreCategories
        titleDataAid={MF_LANDING.financialTools.dataAid}
        title={MF_LANDING.financialTools.title}
        categories={FINANCIAL_TOOLS}
        onClick={handleExploreCategories}
      />
    ),
    trendingFunds: (
      <TrendingFunds
        diyType="equity"
        config={baseConfig}
        handleFundDetails={handleFundDetails}
        isLanding
      />
    ),
    portfolioTracker: (
      <>
        {showExternalPortfolio && (
          <CardHorizontal
            className="mfl-kyc"
            rightImgSrc={require(`assets/${baseConfig.productName}/${externalPortfolioData.icon}`)}
            title={externalPortfolioData.title}
            description={externalPortfolioData.subtitle}
            descriptionColor="foundationColors.content.secondary"
            actionLink={externalPortfolioData.buttonTitle}
            dataAid={externalPortfolioData.dataAid}
          />
        )}
      </>
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
