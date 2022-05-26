import React from "react";
import {
  EXPLORE_CATEGORIES,
  kycData,
  MARKETING_BANNERS,
  MF_INVESTMENT_OPTIONS,
} from "../../pages/AppLanding/common/constants";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { navigate as navigateFunc } from "../../utils/functions";

const screen = "MF_LANDING";
const mfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);

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
