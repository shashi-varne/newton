import React from "react";
import { withRouter } from "react-router-dom";
import { Stack } from "@mui/material";
import Lottie from "lottie-react";
import Typography from "../../atoms/Typography";
import Button from "../../atoms/Button";
import {
  LandingHeader,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "../../molecules/LandingHeader";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import "./PageError.scss";

const PageError = ({
  title = "Something went wrong",
  subtitle = "Sorry, we would not process your request",
  buttonTitle = "Retry",
  noPadding,
  handleClick,
  ...restProps
}) => {
  const { productName } = getConfig();
  const navigate = navigateFunc.bind(restProps);

  const redirectToHelp = () => {
    navigate("/help");
  };

  return (
    <Stack
      className="page-error"
      spacing="12px"
      sx={{ px: noPadding ? "0px" : "16px" }}
    >
      <Stack className="pe-content" justifyContent="center">
        <LandingHeader variant="center" dataAid="somethingWentWrong">
          <Lottie
            animationData={require(`assets/${productName}/lottie/no_mf_order.json`)}
            autoPlay
            loop
            data-aid="iv_top"
            className="pe-icon"
          />
          <LandingHeaderTitle>{title}</LandingHeaderTitle>
          <LandingHeaderSubtitle>{subtitle}</LandingHeaderSubtitle>
        </LandingHeader>
        <Button
          className="pe-retry"
          title={buttonTitle}
          variant="outlined"
          dataAid="retry"
          onClick={handleClick}
        />
      </Stack>
      <Stack
        className="pe-footer"
        flexDirection="row"
        alignItems="center"
        gap="8px"
      >
        <Typography variant="body2" dataAid="infoText">
          Contact our customer support
        </Typography>
        <Button
          dataAid="getHelp"
          variant="link"
          title="Get Help"
          onClick={redirectToHelp}
        />
      </Stack>
    </Stack>
  );
};

export default withRouter(PageError);
