import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import "./Landing.scss";
import OnboardingCarousels from "./OnboardingCarousels";

const Landing = (props) => {
  const { setSwiper, handleSlideChange, tabValue, handleTabChange } = props;
  return (
    <Container
      noPadding={true}
      noFooter={true}
      className="landing-main-wrapper"
    >
      <OnboardingCarousels
        setSwiper={setSwiper}
        tabValue={tabValue}
        handleSlideChange={handleSlideChange}
        handleTabChange={handleTabChange}
      />
    </Container>
  );
};

export default Landing;
