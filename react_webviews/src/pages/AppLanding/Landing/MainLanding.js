import React from "react";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import InfoCard from "../../../designSystem/molecules/InfoCard";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import PlatformMotivators from "../../../featureComponent/appLanding/PlatformMotivators";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";
import PortfolioOverview from "../../../featureComponent/appLanding/PortfolioOverview";
import AuthVerification from "../../../featureComponent/appLanding/AuthVerification";
import Campaign from "../../../featureComponent/appLanding/Campaign";
import PremiumOnboarding from "../../../featureComponent/appLanding/PremiumOnboarding";
import KycBottomsheet from "../../../featureComponent/appLanding/KycBottomsheet";
import { BOTTOMSHEET_KEYS } from "../../../constants/webappLanding";
import { LANDING } from "../../../strings/webappLanding";
import ManageInvestments from "../../../featureComponent/appLanding/ManageInvestments";
import ApplyReferral from "../../../featureComponent/appLanding/ApplyReferral";

const { easySipData, shareReferralData, portfolioData } = LANDING;

const MainLanding = ({
  loaderData,
  handleReferralBottomsheet,
  referralData = {},
  kycBottomsheetData = {},
  handleKycPrimaryClick,
  bottomsheetStates,
  closeBottomsheet,
  handleKycSecondaryClick,
  handleAuthEdit,
  authData,
  campaignData,
  onCampaignPrimaryClick,
  closeCampaignDialog,
  handleAuthVerification,
  handlePremiumOnboarding,
  showPartnership,
  ...restProps
}) => {
  return (
    <>
      <LandingSections loaderData={loaderData} {...restProps} />
      <TrustIcon
        dataAid="fisdom"
        variant="registration"
        className="lmw-trust-icon"
      />
      {showPartnership && <Partnership className="lmw-partnership" />}
      <BottomSheet
        isOpen={bottomsheetStates.openReferral}
        onClose={closeBottomsheet(
          BOTTOMSHEET_KEYS.openReferral,
          referralData.title
        )}
        title={referralData.title}
        imageTitleSrc={referralData.image}
        subtitle={referralData.subtitle}
        primaryBtnTitle={referralData.primaryButtonTitle}
        onPrimaryClick={handleReferralBottomsheet}
        dataAid={referralData.dataAid}
      />
      {bottomsheetStates.openKycStatusDialog && (
        <KycBottomsheet
          isOpen={bottomsheetStates.openKycStatusDialog}
          onClose={closeBottomsheet(
            BOTTOMSHEET_KEYS.openKycStatusDialog,
            kycBottomsheetData.title
          )}
          dataAid={LANDING.kycDataAid}
          data={kycBottomsheetData}
          onPrimaryClick={handleKycPrimaryClick}
          onSecondaryClick={handleKycSecondaryClick}
        />
      )}
      {bottomsheetStates.openPremiumOnboarding && (
        <PremiumOnboarding
          isOpen={bottomsheetStates.openPremiumOnboarding}
          onClose={closeBottomsheet(
            BOTTOMSHEET_KEYS.openPremiumOnboarding,
            kycBottomsheetData.title
          )}
          onClick={handlePremiumOnboarding}
          data={kycBottomsheetData}
        />
      )}
      {bottomsheetStates.openAuthVerification && (
        <AuthVerification
          isOpen={bottomsheetStates.openAuthVerification}
          onClose={closeBottomsheet(
            BOTTOMSHEET_KEYS.openAuthVerification,
            authData.title
          )}
          handleEdit={handleAuthEdit}
          authData={authData}
          onClick={handleAuthVerification}
          showLoader={loaderData.bottomsheetLoader}
        />
      )}
      <Campaign
        isOpen={bottomsheetStates.openCampaign}
        onClose={closeCampaignDialog}
        onPrimaryClick={onCampaignPrimaryClick}
        onSecondaryClick={closeCampaignDialog}
        campaignData={campaignData}
      />
    </>
  );
};

export default MainLanding;

const LandingSections = ({
  showPlatformMotivators,
  showMarketingBanners,
  showKycCard,
  showShareReferral,
  showApplyReferral,
  showSetupEasySip,
  showExploreCategories,
  showPortfolioOverview,
  feature,
  kycData = {},
  marketingBanners,
  investmentOptions,
  platformMotivators,
  exploreCategories,
  manageInvestments,
  loaderData,
  portfolioOverViewData,
  handleKyc,
  handleCardClick,
  handleExploreCategories,
  handleEasySip,
  handleReferral,
  handleManageInvestments,
  onMarketingBannerClick,
  isPageLoading,
  handleReferralChange,
  referral,
  showPortfolioLoader,
  landingSections,
}) => {
    console.log("landingSections ", landingSections)
  const cardsMapper = {
    platformMotivators: (
      <>
        {showPlatformMotivators && (
          <PlatformMotivators options={platformMotivators} />
        )}
      </>
    ),
    portfolioOverview: (
      <PortfolioOverview
        showLoader={showPortfolioLoader}
        portfolioOverViewData={portfolioOverViewData}
        portfolioData={portfolioData}
        showPortfolioOverview={showPortfolioOverview}
        onClick={handleCardClick(portfolioData)}
      />
    ),
    marketingBanners: (
      <>
        {showMarketingBanners && (
          <MarketingBanners
            banners={marketingBanners}
            onClick={onMarketingBannerClick}
          />
        )}
      </>
    ),
    easySip: (
      <>
        {showSetupEasySip && (
          <WrapperBox elevation={1} className="lmw-setup-easysip">
            <InfoCard
              imgSrc={require(`assets/${easySipData.icon}`)}
              rightImgSrc={require(`assets/fisdom/${easySipData.rightIcon}`)}
              title={easySipData.title}
              subtitle={easySipData.subtitle}
              dataAid={easySipData.dataAid}
              onClick={handleEasySip}
            />
          </WrapperBox>
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
            descriptionColor={
              kycData.descriptionColor || "foundationColors.content.secondary"
            }
            actionLink={kycData.buttonTitle}
            className="lmw-kyc"
            variant="heroCard"
            buttonProps={{
              isInverted: false,
            }}
            sx={{
              background: "white !important",
            }}
            dataAid={LANDING.kycDataAid}
            titleColor="foundationColors.content.primary"
            onClick={handleKyc(kycData.eventStatus)}
            showLoader={isPageLoading}
          />
        )}
      </>
    ),
    featuresList: (
      <InvestmentOptions
        titleDataAid={LANDING.investmentOptions.dataAid}
        title={LANDING.investmentOptions.title}
        productList={investmentOptions}
        onClick={handleCardClick}
        feature={feature}
        isLoading={showKycCard && isPageLoading}
      />
    ),
    exploreCategories: (
      <>
        {showExploreCategories && (
          <ExploreCategories
            categories={exploreCategories}
            titleDataAid={LANDING.exploreCategories.dataAid}
            title={LANDING.exploreCategories.title}
            onClick={handleExploreCategories}
          />
        )}
      </>
    ),
    manageInvestments: (
      <ManageInvestments
        manageInvestments={manageInvestments}
        onClick={handleManageInvestments}
      />
    ),
    referral: (
      <>
        {showApplyReferral && (
          <ApplyReferral
            onClick={handleReferral}
            handleChange={handleReferralChange}
            referral={referral}
            isLoading={loaderData?.dotLoader}
          />
        )}
        {showShareReferral && (
          <WrapperBox elevation={1} className="lmw-share-code">
            <CardHorizontal
              dataAid={shareReferralData.dataAid}
              title={shareReferralData.title}
              subtitle={shareReferralData.subtitle}
              rightImgSrc={require(`assets/${shareReferralData.rightIcon}`)}
              onClick={handleReferral}
            />
          </WrapperBox>
        )}
      </>
    ),
  };
  return (
    <>
      {landingSections.map((el, index) => {
        return <React.Fragment key={index}>{cardsMapper[el]}</React.Fragment>;
      })}
    </>
  );
};
