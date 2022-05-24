import React, { useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { navigate as navigateFunc } from "../../utils/functions";
import { ONBOARDING_CAROUSALS } from "../../pages/AppLanding/common/constants";

const screen = "LANDING";
const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = () => {
    const value = tabValue + 1;
    if (value > ONBOARDING_CAROUSALS.length - 1) return;
    setTabValue(value);
  };

  return (
    <WrappedComponent
      tabValue={tabValue}
      handleTabChange={handleTabChange}
      carousalsData={ONBOARDING_CAROUSALS}
    />
  );
};

export default landingContainer(Landing);
