import React from "react";
import { Typography } from "@mui/material";
import { Imgc } from "../../../common/ui/Imgc";
import "./EMandateTrustIcon.scss";

const EMandateTrustIcon = (props) => {
  const { className = "", dataAid = "", ...restProps } = props;
  return (
    <div
      className={`atom-e-mandate-trust-icon ${className}`}
      data-aid={`eMandateTrustIcon-${dataAid}`}
      {...restProps}
    >
      <Typography variant="body5" color="foundationColors.content.secondary">
        e-mandate powered by
      </Typography>
      <Imgc
        className="aemti-icon"
        src={require("assets/trust_icons_emandate.svg")}
        alt="NACH"
      />
    </div>
  );
};

export default EMandateTrustIcon;
