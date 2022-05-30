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
} from "../../pages/AppLanding/common/constants";

const screen = "LANDING";
const portfolioOverViewData = {
  currentValue: "₹19.6Cr",
  investedValue: "₹3.5Cr",
  profitOrLoss: "+ ₹1.2Cr",
  isProfit: true,
};
const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [tabValue, setTabValue] = useState(0);
  const [showCarousals, setShowCarousals] = useState(true);
  const [openReferral, setOpenReferral] = useState(true);
  const [openKyc, setOpenkyc] = useState(false);
  const kycData = KYC_CARD_STATUS_MAPPER.submitted;
  const kycBottomsheetData = KYC_BOTOMSHEET_STATUS_MAPPER.esign_ready;

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

  const closeReferral = () => {
    setOpenReferral(false);
  };

  const closeKyc = () => {
    setOpenkyc(false);
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
      openReferral={openReferral}
      closeReferral={closeReferral}
      kycBottomsheetData={kycBottomsheetData}
      openKyc={openKyc}
    />
  );
};

export default landingContainer(Landing);
