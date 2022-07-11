import { Stack } from "@mui/material";
import React from "react";
import Typography from "../../designSystem/atoms/Typography";

const BottomsheetRow = ({ label, value, labelId, valueId, valueColor }) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent="space-between"
      style={{ marginBottom: 24 }}
    >
      <Typography
        variant="heading4"
        color={"foundationColors.content.primary"}
        dataAid={labelId}
      >
        {label}
      </Typography>
      <Typography
        variant="body8"
        color={valueColor || "foundationColors.content.primary"}
        dataAid={valueId}
      >
        {value}
      </Typography>
    </Stack>
  );
};

export default BottomsheetRow;
