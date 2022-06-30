import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import { WALLET_TRANSFERS } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";

import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "../../../designSystem/molecules/LandingHeader/LandingHeader";

const STRINGS = WALLET_TRANSFERS;

const NoTransferView = ({ filterApplied, productName }) => {
  if (filterApplied.value === "all") {
    return (
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: "70vh" }}
      >
        <LandingHeader variant={"center"}>
          <LandingHeaderImage
            imgSrc={require(`assets/${productName}/iv_no_rewards.svg`)}
          />
          <LandingHeaderTitle align="center">
            {STRINGS.noTransferLandingHeader.title}
          </LandingHeaderTitle>
          <LandingHeaderSubtitle dataIdx={1} align="center">
            {STRINGS.noTransferLandingHeader.subtitle}
          </LandingHeaderSubtitle>
        </LandingHeader>
      </Stack>
    );
  }

  return (
    <Stack sx={{ mt: "120px" }} alignItems="center" justifyContent={"center"}>
      <Typography variant="body8" color="foundationColors.content.secondary">
        No {filterApplied.label.toLowerCase()} transactions
      </Typography>
    </Stack>
  );
};

export default NoTransferView;
