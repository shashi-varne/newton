import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Lottie from "lottie-react";
import Typography from "../../../designSystem/atoms/Typography";
import { WITHDRAW_PLACED } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";
import "./WithdrawPlaced.scss";

const sound = require(""); // Audio file path to be added
const STRINGS = WITHDRAW_PLACED;

const WithdrawPlaced = ({ productName = "fisdom", sendEvents }) => {
  return (
    <Container
      headerProps={{
        headerSx: { display: "none" },
      }}
      className="reward-withdrawal-placed"
      dataAid={STRINGS.screenDataAid}
      eventData={sendEvents("just_set_events")}
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
          className="rwp-success-lottie-anim"
          data-aid={`iv_${STRINGS.animationDataAid}`}
        />
        <Typography
          variant="heading2"
          color={"foundationColors.content.primary"}
          dataAid={STRINGS.successTitle.dataAid}
          textAlign="center"
        >
          {STRINGS.successTitle.text}
        </Typography>
      </Stack>
      <audio autoPlay={true}>
        <source src={sound} type="audio/mp3" />
      </audio>
    </Container>
  );
};

export default WithdrawPlaced;
