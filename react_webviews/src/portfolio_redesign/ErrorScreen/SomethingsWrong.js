import { Box } from "@mui/material";
import React from "react";
import Button from "../../designSystem/atoms/Button";
import {
  LandingHeader,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
  LandingHeaderImage,
} from "../../designSystem/molecules/LandingHeader";
import Container from "../../designSystem/organisms/ContainerWrapper";
import "./SomethingsWrong.scss";

const SomethingsWrong = ({ onClickCta }) => {
  return (
    <Container className="something-went-wrong-container">
      <Box className="something-went-wrong-wrapper">
        <LandingHeader variant={"center"} dataAid={"somethingWentWrong"}>
          <LandingHeaderImage
            imgSrc={require("assets/portfolio_something_wrong.svg")}
          />
          <LandingHeaderTitle align="center">
            Something's wrong
          </LandingHeaderTitle>
          <LandingHeaderSubtitle align="center" dataIdx={1}>
            Currently, we're having an issue loading your portfolio details
          </LandingHeaderSubtitle>
        </LandingHeader>
        <Button
          title="RETRY"
          dataAid="retry"
          onClick={onClickCta}
          style={{ marginTop: 16 }}
        />
      </Box>
    </Container>
  );
};

export default SomethingsWrong;
