import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "../../designSystem/atoms/Typography";
import Icon from "../../designSystem/atoms/Icon";
import { getConfig } from "../../utils/functions";

const Partnership = ({ className, ...restProps }) => {
  const { colorLogo, productName } = useMemo(getConfig, []);
  return (
    <Box className={`text-center ${className}`} {...restProps}>
      <Typography variant="body4" component="div" dataAid="text">
        In partnership with
      </Typography>
      <Icon
        src={require(`assets/${colorLogo}`)}
        dataAid={productName}
        height="24px"
      />
    </Box>
  );
};

export default Partnership;
