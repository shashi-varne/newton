import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import OnboardingCarousels from "./OnboardingCarousels";

import "./Landing.scss";

const Landing = (props) => {
  const { carousalsData, tabValue, handleTabChange } = props;
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="landing-main-wrapper"
      dataAid="onboarding"
    >
      <OnboardingCarousels
        carousalsData={carousalsData}
        tabValue={tabValue}
        handleTabChange={handleTabChange}
      />
    </Container>
  );
};

export default Landing;
