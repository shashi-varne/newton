import { Box, Stack } from "@mui/material";
import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import { ALLOCATIONS_LANDING } from "businesslogic/strings/portfolio";
import { formatAmountInr } from "../../utils/validators";

const InvestmentCard = ({ currentValue, profitLoss }) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems="flex-start"
      justifyContent={"space-between"}
      className="investment-card"
    >
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="body2"
          color={"foundationColors.content.secondary"}
          dataAid={ALLOCATIONS_LANDING.keyCurrent.dataAid}
        >
          {ALLOCATIONS_LANDING.keyCurrent.text}
        </Typography>
        <Typography
          variant="body8"
          color={"foundationColors.content.primary"}
          dataAid={ALLOCATIONS_LANDING.valueCurrent.dataAid}
        >
          {formatAmountInr(currentValue)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="body2"
          color={"foundationColors.content.secondary"}
          dataAid={ALLOCATIONS_LANDING.keyPl.dataAid}
        >
          {ALLOCATIONS_LANDING.keyPl.text}
        </Typography>
        <Typography
          variant="body8"
          color={
            profitLoss >= 0
              ? "foundationColors.secondary.profitGreen.400"
              : "foundationColors.secondary.lossRed.400"
          }
          dataAid={ALLOCATIONS_LANDING.valuePl.dataAid}
        >
          {profitLoss < 0 && "-"}
          {formatAmountInr(Math.abs(profitLoss))}
        </Typography>
      </Box>
    </Stack>
  );
};

export default InvestmentCard;
