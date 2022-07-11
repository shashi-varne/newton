import { Stack } from "@mui/material";
import React from "react";

const RowContainer = ({ children, ...props }) => {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      {children}
    </Stack>
  );
};

export default RowContainer;
