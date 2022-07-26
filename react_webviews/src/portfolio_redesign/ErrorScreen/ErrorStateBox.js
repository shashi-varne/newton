import { Box, Stack } from "@mui/material";
import React from "react";
import Button from "../../designSystem/atoms/Button";
import Typography from "../../designSystem/atoms/Typography";
import "./ErrorStateBox.scss";

export const ERROR_STATE_BOX_VARIANTS = {
  DOWNTIME: "downtime",
  NO_INVESTMENT: "noInvestment",
  NO_EXTERNAL_PORTFOLIO: "noExternalPortfolio",
};

const backgroundColorMapper = {
  downtime: "foundationColors.primary.200",
  noInvestment: "foundationColors.secondary.lossRed.200",
  noExternalPortfolio: "foundationColors.secondary.lossRed.200",
};

const textColorMapper = {
  downtime: "foundationColors.content.primary",
  noInvestment: "foundationColors.secondary.lossRed.400",
  noExternalPortfolio: "foundationColors.secondary.lossRed.400",
};

function ErrorStateBox({ text, onClickRefresh, variant, sx }) {
  return (
    <Box
      className="errorstate-box"
      sx={{
        backgroundColor: backgroundColorMapper[variant],
      }}
    >
      <Stack
        alignItems={"center"}
        flexDirection="row"
        justifyContent={"space-between"}
      >
        <Typography
          variant="body2"
          color={textColorMapper[variant]}
          dataAid="infoText"
        >
          {text}
        </Typography>
        {variant !== ERROR_STATE_BOX_VARIANTS.DOWNTIME && (
          <Button
            title="Refresh"
            variant={"link"}
            dataAid="secondary"
            onClick={onClickRefresh}
          />
        )}
      </Stack>
    </Box>
  );
}

export default ErrorStateBox;
