import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
// import OnboardingCarousels from "./OnboardingCarousels";
import Demo from "./Demo";
import MainLanding from "./MainLanding";
import { LANDING } from "../../../strings/webappLanding";

import "./Landing.scss";

const Landing = (props) => {
  const {
    carousalsData,
    tabValue,
    showCarousals,
    showSeachIcon,
    handleCarousels,
    handleDiySearch,
    handleNotification,
    isFetchFailed,
    loaderData,
    errorData,
    sendEvents,
    hideBackIcon,
    longPressEvent,
    setSwiper,
    handleSlideChange,
    isLongPressTriggered,
    ...restProps
  } = props;

  return (
    <Container
      noPadding={true}
      noFooter={true}
      className={`landing-main-wrapper ${
        showCarousals && `landing-onboarding-wrapper`
      }`}
      dataAid={showCarousals ? LANDING.onboardingDataAid : LANDING.dataAid}
      noHeader={showCarousals}
      headerProps={{
        dataAid: LANDING.dataAid,
        showPartnerLogo: true,
        rightIconSrc2: require("assets/notification_badge.svg"),
        rightIconSrc: showSeachIcon ? require("assets/search_diy.svg") : null,
        onRightIconClick2: handleNotification,
        onRightIconClick: handleDiySearch,
        hideLeftIcon: hideBackIcon,
      }}
      eventData={sendEvents("just_set_events")}
      isFetchFailed={isFetchFailed}
      isPageLoading={loaderData.skelton || loaderData.pageLoader}
      errorData={errorData}
    >
      {showCarousals ? (
        <Demo
          carousalsData={carousalsData}
          tabValue={tabValue}
          handleClose={handleCarousels(true, false)}
          handleNext={handleCarousels(false, false)}
          handleBack={handleCarousels(false, true)}
          longPressEvent={longPressEvent}
          setSwiper={setSwiper}
          handleSlideChange={handleSlideChange}
          isLongPressTriggered={isLongPressTriggered}
        />
      ) : (
        <MainLanding
          loaderData={loaderData}
          longPressEvent={longPressEvent}
          {...restProps}
        />
      )}
    </Container>
  );
};

export default Landing;
