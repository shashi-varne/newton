import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Lottie from "lottie-react";
import { SUCCESS_DETAILS } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";
import {
  LandingHeader,
  LandingHeaderPoints,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "../../../designSystem/molecules/LandingHeader";
import Typography from "../../../designSystem/atoms/Typography";
import "./SuccessDetails.scss";

const STRINGS = SUCCESS_DETAILS;

const SuccessDetails = ({
  date,
  amount,
  productName = "fisdom",
  sendEvents,
  isPageLoading,
  onClickCta,
}) => {
  return (
    <Container
      headerProps={{
        showCloseIcon: true,
      }}
      footer={{
        button1Props: {
          title: STRINGS.cta,
          onClick: onClickCta,
        },
      }}
      isPageLoading={isPageLoading}
      className="success-details"
      dataAid={STRINGS.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      <Stack direction="column" alignItems="center" justifyContent="center">
        <LandingHeader variant="center" dataAid={STRINGS.landingHeader.dataAid}>
          <Lottie
            animationData={require(`assets/${productName}/lottie/calendar.json`)}
            autoPlay
            loop
            className="sd-lottie-anim"
            data-aid="iv_top"
          />
          <LandingHeaderTitle align="center">
            {STRINGS.landingHeader.title}
          </LandingHeaderTitle>
          <LandingHeaderPoints dataIdx={1} align="center">
            <Typography
              component="span"
              variant="body2"
              color="foundationColors.content.primary"
            >
              {STRINGS.landingHeader.point1}
            </Typography>
            {date}
          </LandingHeaderPoints>
          <LandingHeaderPoints dataIdx={2} align="center">
            <Typography
              component="span"
              variant="body2"
              color="foundationColors.content.primary"
            >
              {STRINGS.landingHeader.point2}
            </Typography>
            {amount}
          </LandingHeaderPoints>
          <LandingHeaderSubtitle dataIdx={3} align="center">
            {STRINGS.landingHeader.subtitle}
          </LandingHeaderSubtitle>
        </LandingHeader>
      </Stack>
    </Container>
  );
};

export default SuccessDetails;
