import React, { useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import Container from "designSystem/organisms/ContainerWrapper";
import Button from "designSystem/atoms/Button";
import Typography from "designSystem/atoms/Typography";
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "designSystem/molecules/LandingHeader";
import "./style.scss";
import PropTypes from "prop-types";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import ReturnCalculator from "./ReturnCalculator";
import { nativeCallback } from "../../../utils/native_callback";

export const INFO_ACTION_VARIANT = {
  WITH_ACTION: "WITH_ACTION",
  WITHOUT_ACTION: "WITHOUT_ACTION",
};

const WithoutActionSubtitle = (subtitle) => {
  return (
    <Typography
      variant="inherit"
      color="inherit"
      className="custom-text-elipsis"
    >
      {subtitle}
    </Typography>
  );
};

const WithActionSubtitle = (setIsOpen, subtitle) => {
  return (
    <Typography
      variant="inherit"
      color="inherit"
      className="custom-text-elipsis"
    >
      {subtitle}
      <Button
        variant="link"
        title="Calculate returns"
        className="btn-calculate-returns"
        onClick={() => setIsOpen(true)}
      />
    </Typography>
  );
};

function InfoAction({
  title,
  ctaTitle,
  subtitle,
  dataAidSuffix = "",
  eventName,
  screenName,
  variant = INFO_ACTION_VARIANT.WITH_ACTION,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const eventRef = useRef({
    screen_name: screenName,
    user_action: "back",
    user_application_status: "init",
    user_investment_status: false,
    user_kyc_status: false,
  });

  const sendEvents = (events, userAction = "back") => {
    const eventObj = {
      event_name: eventName,
      properties: eventRef.current,
    };
    const properties = {
      ...eventObj.properties,
      ...events,
      user_action: userAction,
    };
    eventRef.current = properties;
    eventObj.properties = properties;
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };
  const WithoutActionSubtitle = (subtitle) => {
    return (
      <Typography
        variant="inherit"
        color="inherit"
        className="custom-text-elipsis"
      >
        {subtitle}
      </Typography>
    );
  };

  const openCalculator = () => {
    setIsOpen(true);
    sendEvents({
      screen_name: "return calculator",
      calculated_for: "mutual funds",
      slider_use: "no",
      "investment period": "1Y",
    });
  };
  const WithActionSubtitle = (setIsOpen, subtitle) => {
    return (
      <Typography
        variant="inherit"
        color="inherit"
        className="custom-text-elipsis"
      >
        {subtitle}
        <Button
          variant="link"
          title="Calculate returns"
          className="btn-calculate-returns"
          onClick={openCalculator}
        />
      </Typography>
    );
  };
  const handleCta = () => {
    sendEvents({}, ctaTitle?.toLowerCase());
  };

  return (
    <Container
      headerProps={{
        headerTitle: "Portfolio",
        hideInPageTitle: true,
      }}
      className="infoAction-wrapper"
      noFooter
    >
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className="main-container"
      >
        <Box style={{ marginBottom: 24 }}>
          <LandingHeader dataAid={dataAidSuffix} variant="center">
            <LandingHeaderImage
              imgSrc={require("assets/portfolio_no_investment.svg")}
            />
            <LandingHeaderTitle align="center">{title}</LandingHeaderTitle>
            <LandingHeaderSubtitle align="center" dataIdx={1}>
              {variant === INFO_ACTION_VARIANT.WITHOUT_ACTION
                ? WithoutActionSubtitle(subtitle)
                : WithActionSubtitle(setIsOpen, subtitle)}
            </LandingHeaderSubtitle>
          </LandingHeader>
        </Box>
        <Button
          dataAid="primary"
          variant={"container"}
          title={ctaTitle}
          onClick={handleCta}
        />
      </Stack>
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBackdropClick={() => setIsOpen(false)}
      >
        <ReturnCalculator sendEvents={sendEvents} />
      </BottomSheet>
    </Container>
  );
}

InfoAction.defaultProps = {
  title: "",
  subtitle: "",
  // variant: INFO_ACTION_VARIANT.WITHOUT_ACTION,
};

InfoAction.defaultProps = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.string.isRequired,
};

export default InfoAction;
