import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import OnboardingCarousels from "./OnboardingCarousels";
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
        rightIconSrc: require("assets/notification_badge.svg"),
        rightIconSrc2: showSeachIcon ? require("assets/search_diy.svg") : null,
        onRightIconClick: handleNotification,
        onRightIconClick2: handleDiySearch,
        hideLeftIcon: hideBackIcon
      }}
      eventData={sendEvents("just_set_events")}
      isFetchFailed={isFetchFailed}
      isPageLoading={loaderData.skelton || loaderData.pageLoader}
      errorData={errorData}
    >
      {showCarousals ? (
        <OnboardingCarousels
          carousalsData={carousalsData}
          tabValue={tabValue}
          handleClose={handleCarousels(true, false)}
          handleNext={handleCarousels(false, false)}
          handleBack={handleCarousels(false, true)}
        />
      ) : (
        <MainLanding loaderData={loaderData} {...restProps} />
      )}
    </Container>
  );
};

export default Landing;
