import Stack from "@mui/material/Stack";
import Lottie from "lottie-react";
import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import "./Success.scss";

const Success = ({
  sendEvents,
  onClick = () => {},
  productName = "fisdom",
  dataAid = "",
  title = "",
  titleDataAid = "title",
  subtitle = "",
  subtitleDataAid = "subtitle",
  onBackClick,
  isPageLoading = false,
}) => {
  return (
    <Container
      eventData={sendEvents("just_set_events")}
      headerProps={{
        headerSx: { display: "none" },
        onBackClick
      }}
      footer={{
        button1Props: {
          title: "Okay",
          onClick,
        },
      }}
      isPageLoading={isPageLoading}
      className="success-wrapper"
      dataAid={dataAid}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: "70vh" }}
      >
        <Lottie
          animationData={require(`assets/${productName}/lottie/success_animation.json`)}
          autoPlay
          loop
          className="success-lottie-anim"
          data-aid="iv_success"
        />
        <Typography
          variant="heading2"
          color={"foundationColors.content.primary"}
          dataAid={titleDataAid}
          textAlign="center"
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color={"foundationColors.content.secondary"}
          style={{ marginTop: "8px" }}
          dataAid={subtitleDataAid}
          textAlign="center"
        >
          {subtitle}
        </Typography>
      </Stack>
    </Container>
  );
};

export default Success;
