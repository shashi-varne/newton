import { Box, Stack } from "@mui/material";
import React from "react";
import Typography from "../../designSystem/atoms/Typography";

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
          dataAid="keyCurrent"
        >
          Current value
        </Typography>
        <Typography
          variant="body8"
          color={"foundationColors.content.primary"}
          dataAid="valueCurrent"
        >
          ₹3,00,00,500
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="body2"
          color={"foundationColors.content.secondary"}
          dataAid="keyCurrent"
        >
          P&amp;L
        </Typography>
        <Typography
          variant="body8"
          color={"foundationColors.secondary.profitGreen.400"} //TODO: add loss color as well conditionally
          dataAid="valueCurrent"
        >
          ₹3,00,00,500
        </Typography>
      </Box>
    </Stack>
  );
};

export default InvestmentCard;
