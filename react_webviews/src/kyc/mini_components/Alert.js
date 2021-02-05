import React from "react";
import { getConfig } from "utils/functions";

const productName = getConfig().productName;
let alertVariants = {
  danger: {
    bgColor: "#fff5f6",
    icon: "error_icon.svg",
  },
  success: {
    bgColor: "#f9fff1",
    icon: "success_icon.svg",
  },
  attention: {
    bgColor: "#fff5f6",
    icon: "attention_icon.svg",
  },
  info: {
    icon: `${productName}/info_icon.svg`,
    bgColor: "none",
  },
  warning: {
    icon: `attention_icon_new.svg`,
    bgColor: "#fff6ce",
  },
};

const Alert = ({ message, variant, title }) => {
  return (
    <div
      className="alert-status-info"
      style={{ backgroundColor: alertVariants[variant].bgColor }}
    >
      <img
        src={require(`assets/${alertVariants[variant].icon}`)}
        alt={variant}
      />
      <div className="text">
        <div className="title">{title}</div>
        <div>{message}</div>
      </div>
    </div>
  );
};

export default Alert;
