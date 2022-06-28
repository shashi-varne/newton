import React from "react";
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

const INFO_ACTION_VARIANT = {
  WITH_ACTION: "WITH_ACTION",
  WITHOUT_ACTION: "WITHOUT_ACTION",
};

const WithoutActionSubtitle = () => {
  return (
    <Typography
      variant="inherit"
      color="inherit"
      className="custom-text-elipsis"
    >
      Your investments will start to appear here in a while
    </Typography>
  );
};

const WithActionSubtitle = () => {
  return (
    <Typography
      variant="inherit"
      color="inherit"
      className="custom-text-elipsis"
    >
      Join 5M + Indians who invest their money to grow their money. Returns from
      investments help to build wealth with no sweat!
      <Button variant="link" title="Calculate returns" />
    </Typography>
  );
};

function InfoAction({
  topImage,
  title,
  subtitle,
  variant = INFO_ACTION_VARIANT.WITH_ACTION,
}) {
  return (
    <Container
      headerProps={{
        headerTitle: "Title",
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
          <LandingHeader dataAid="updatingShortly" variant="center">
            <LandingHeaderImage
              imgSrc={require("assets/updating_shortly.svg")}
            />
            <LandingHeaderTitle>I am title</LandingHeaderTitle>
            <LandingHeaderSubtitle dataIdx={1}>
              {variant === INFO_ACTION_VARIANT.WITHOUT_ACTION
                ? WithoutActionSubtitle()
                : WithActionSubtitle()}
            </LandingHeaderSubtitle>
          </LandingHeader>
        </Box>
        <Button dataAid="primary" variant={"container"} title="VIEW ORDERS" />
      </Stack>
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
