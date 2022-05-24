import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import OnboardingCarousels from "./OnboardingCarousels";

import "./Landing.scss";

const Landing = (props) => {
  const { carousalsData, tabValue, handleTabChange, showCarousals, handleClose } = props;
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="landing-main-wrapper"
      dataAid="onboarding"
    >
      {showCarousals ? (
        <OnboardingCarousels
          carousalsData={carousalsData}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          handleClose={handleClose}
        />
      ) : (
        <>

        </>
      )}
    </Container>
  );
};

export default Landing;
