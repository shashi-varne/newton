import React from "react";
import { Typography } from "@mui/material";
import { Imgc } from "../../../ui/Imgc";
import color from "../../../../theme/colors";
import "./EMandateTrustIcon.scss";

const EMandateTrustIcon = (props) => {
  const { className = "", dataAid = "" } = props;
  return (
    <div
      className={`atom-e-mandate-trust-icon ${className}`}
      data-aid={`eMandateTrustIcon-${dataAid}`}
    >
      <Typography variant="body5" color={color.content.secondary}>
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
