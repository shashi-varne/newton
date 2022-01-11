import React from "react";
import { Box } from "@mui/material";
import Typography from '../Typography';
import { Imgc } from "../../../common/ui/Imgc";
import "./EMandateTrustIcon.scss";

const EMandateTrustIcon = (props) => {
  const { className = "", opacity, margin, dataAid = "", ...restProps } = props;
  return (
    <Box
      className={`atom-e-mandate-trust-icon ${className}`}
      data-aid={`eMandateTrustIcon_${dataAid}`}
      sx={{ opacity, margin }}
      {...restProps}
    >
      <Typography
        variant="body5"
        color="foundationColors.content.secondary"
        data-aid="tv_title"
      >
        e-mandate powered by
      </Typography>
      <Imgc
        className="aemti-icon"
        src={require("assets/trust_icons_emandate.svg")}
        alt="NACH"
      />
    </Box>
  );
};

export default EMandateTrustIcon;
