import React, { useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { navigate as navigateFunc } from "../../utils/functions";
import {
  EASY_SIP_DATA,
  EXPLORE_CATEGORIES,
  INVESTMENT_OPTIONS,
  KYC_BOTOMSHEET_STATUS_MAPPER,
  KYC_CARD_STATUS_MAPPER,
  MANAGE_INVESTMENTS,
  MARKETING_BANNERS,
  ONBOARDING_CAROUSALS,
  PLATFORM_MOTIVATORS,
  REFERRAL_DATA,
  AUTH_VERIFICATION_DATA,
  PREMIUM_ONBORDING_MAPPER,
} from "businesslogic/constants/webAppLanding";

const screen = "LANDING";
const portfolioOverViewData = {
  currentValue: "₹19.6Cr",
  investedValue: "₹3.5Cr",
  profitOrLoss: "+ ₹1.2Cr",
  isProfit: true,
};

const campaignData = {
  title: "Setup easySIP",
  imageSrc:
    "https://eqnom-dot-plutus-staging.appspot.com/static/img/ic_sip_mandate_attention_fisdom.png",
  subtitle:
    "Never miss your monthly SIP payments. Setup a secure easySIP in just 2 minutes.",
  primaryButtonTitle: "continue",
};

const DEFAULT_BOTTOMSHEETS_DATA = {
  openKyc: false,
  openReferral: false,
  openAuthVerification: false,
  openAccountAlreadyExists: false,
  openPremiumOnboarding: true,
  openCampaign: false,
};

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [tabValue, setTabValue] = useState(0);
  const [showCarousals, setShowCarousals] = useState(true);
  const [bottomsheetStates, setBottomsheetStates] = useState(
    DEFAULT_BOTTOMSHEETS_DATA
  );
  const kycData = KYC_CARD_STATUS_MAPPER.submitted;
  const kycBottomsheetData = KYC_BOTOMSHEET_STATUS_MAPPER.esign_ready;
  const premiumData = PREMIUM_ONBORDING_MAPPER.incomplete;

  const handleCarousels = (isClose) => () => {
    const value = tabValue + 1;
    if (value >= ONBOARDING_CAROUSALS.length) {
      if (isClose) {
        setShowCarousals(false);
      }
      return;
    }
    setTabValue(value);
  };

  const handleBottomsheets = (data) => {
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
  };

  const closeBottomsheet = (key) => () => {
    handleBottomsheets({ [key]: false });
  };

  return (
    <WrappedComponent
      tabValue={tabValue}
      handleTabChange={handleCarousels(false)}
      handleClose={handleCarousels(true)}
      carousalsData={ONBOARDING_CAROUSALS}
      showCarousals={showCarousals}
      platformMotivators={PLATFORM_MOTIVATORS}
      marketingBanners={MARKETING_BANNERS}
      easySipData={EASY_SIP_DATA}
      kycData={kycData}
      investmentOptions={INVESTMENT_OPTIONS}
      exploreCategories={EXPLORE_CATEGORIES}
      manageInvestments={MANAGE_INVESTMENTS}
      portfolioOverViewData={portfolioOverViewData}
      showPortfolioOverview={true}
      showPlatformMotivators={true}
      showExploreCategories={true}
      showMarketingBanners={true}
      showApplyReferral={false}
      showShareReferral={true}
      showSetupEasySip={true}
      showKycCard={true}
      showLoader={false}
      referralData={REFERRAL_DATA.success}
      kycBottomsheetData={kycBottomsheetData}
      bottomsheetStates={bottomsheetStates}
      closeBottomsheet={closeBottomsheet}
      authData={AUTH_VERIFICATION_DATA.accountExists}
      campaignData={campaignData}
      premiumData={premiumData}
    />
  );
};

export default landingContainer(Landing);
