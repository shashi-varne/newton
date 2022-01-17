import React from "react";
import { Imgc } from "../../../common/ui/Imgc";
import "./EMandateTrustIcon.scss";
import Typography from '../Typography';

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
        dataAid="title"
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
