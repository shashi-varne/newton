import React from "react";
import { Box } from "@mui/material";
import color from "../../../../theme/colors";

const Separator = (props) => {
  const { className, dataAidSuffix: dataAid } = props;

  return (
    <Box
      className={`atom-separator ${className}`}
      sx={{
        backgroundColor: color.supporting.athensGrey,
        height: "1px",
      }}
      data-aid={`atom-separator-${dataAid}`}
    />
  );
};

export default Separator;
