import React, { useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { navigate as navigateFunc } from "../../utils/functions";
import {
  EASY_SIP_DATA,
  EXPLORE_CATEGORIES,
  INVESTMENT_OPTIONS,
  KYC_CARD_STATUS_MAPPER,
  MANAGE_INVESTMENTS,
  MARKETING_BANNERS,
  ONBOARDING_CAROUSALS,
  PLATFORM_MOTIVATORS,
} from "../../pages/AppLanding/common/constants";

const screen = "LANDING";
const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [tabValue, setTabValue] = useState(0);
  const [showCarousals, setShowCarousals] = useState(true);
  const kycData = KYC_CARD_STATUS_MAPPER.submitted;

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
      showPlatformMotivators={true}
      showExploreCategories={true}
      showMarketingBanners={true}
      showApplyReferral={false}
      showShareReferral={true}
      showSetupEasySip={true}
      showKycCard={true}
    />
  );
};

export default landingContainer(Landing);
