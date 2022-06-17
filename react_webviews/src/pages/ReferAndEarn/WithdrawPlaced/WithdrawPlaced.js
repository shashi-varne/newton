import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Lottie from "lottie-react";
import Typography from "../../../designSystem/atoms/Typography";
import { WITHDRAW_PLACED } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";
import "./WithdrawPlaced.scss";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../common/constants";

const sound = require("assets/audio/success.mp3"); // Audio file path to be added
const STRINGS = WITHDRAW_PLACED;

const WithdrawPlaced = ({ productName = "fisdom", navigate, amount }) => {
  const lottieRef = React.useRef();

  React.useEffect(() => {
    const animationDuration = lottieRef?.current?.getDuration() || 3;
    const animationTimeout = setTimeout(() => {
      navigate(REFER_AND_EARN_PATHNAME_MAPPER.successDetails, {
        state: {
          amount: amount,
        },
      });
    }, animationDuration * 1000);
    return () => {
      clearTimeout(animationTimeout);
    };
  });

  return (
    <Container
      headerProps={{
        headerSx: { display: "none" },
      }}
      className="reward-withdrawal-placed"
      dataAid={STRINGS.screenDataAid}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: "70vh" }}
      >
        <Lottie
          lottieRef={lottieRef}
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
