import React from "react";
import { Imgc } from "../../../common/ui/Imgc";
import { getConfig } from "../../../utils/functions";
import "./mini-components.scss";

const productName = getConfig().productName;
export const StatusInfo = ({ icon, title, subtitle }) => {
  return (
    <div className="status-info">
      <Imgc
        className="status-info-img"
        src={require(`assets/${productName}/${icon}`)}
      />
      <div className="status-info-title">{title}</div>
      <div className="status-info-subtitle">{subtitle}</div>
    </div>
  );
};
