import React, { useState } from "react";
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
  dataAidSuffix,
  variant = INFO_ACTION_VARIANT.WITH_ACTION,
}) {
  const [isOpen, setIsOpen] = useState(false);
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
        <Button dataAid="primary" variant={"container"} title={ctaTitle} />
      </Stack>
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBackdropClick={() => setIsOpen(false)}
      >
        <ReturnCalculator />
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
