import React, { useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { navigate as navigateFunc } from "utils/functions";

const screen = "LANDING";
const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [swiper, setSwiper] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleSlideChange = (swiper) => {
    setTabValue(swiper?.activeIndex);
  };

  const handleTabChange = () => {
    const value = tabValue + 1;
    setTabValue(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };

  return (
    <WrappedComponent
      setSwiper={setSwiper}
      tabValue={tabValue}
      handleSlideChange={handleSlideChange}
      handleTabChange={handleTabChange}
    />
  );
};

export default landingContainer(Landing);
