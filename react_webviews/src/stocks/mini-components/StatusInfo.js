import React from "react";
import { getConfig } from "../../utils/functions";
import "./mini-components.scss";

const productName = getConfig().productName;
export const StatusInfo = ({ icon, title, subtitle }) => {
  return (
    <div className="status-info">
      <img
        className="status-info-img"
        src={require(`assets/${productName}/${icon}`)}
      />
      <div className="status-info-title">{title}</div>
      <div className="status-info-subtitle">{subtitle}</div>
    </div>
  );
};
