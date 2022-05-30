import React from "react";
import {
  EXPLORE_CATEGORIES,
  KYC_CARD_STATUS_MAPPER,
  MARKETING_BANNERS,
  MF_INVESTMENT_OPTIONS,
} from "businesslogic/constants/webAppLanding";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { navigate as navigateFunc } from "../../utils/functions";

const screen = "MF_LANDING";
const mfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const kycData = KYC_CARD_STATUS_MAPPER.rejected;

  return (
    <WrappedComponent
      kycData={kycData}
      marketingBanners={MARKETING_BANNERS}
      investmentOptions={MF_INVESTMENT_OPTIONS}
      exploreCategories={EXPLORE_CATEGORIES}
      showMarketingBanners={true}
      showKycCard={false}
    />
  );
};

export default mfLandingContainer(MfLanding);
