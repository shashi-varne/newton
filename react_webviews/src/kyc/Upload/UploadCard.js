import React from "react";
import { getConfig } from "utils/functions";
import "./commonStyles.scss";

const UploadCard = (props) => {
  const productName = getConfig().productName;
  const {
    default_image,
    title,
    onClick,
    subtitle,
    doc_status,
    approved_image,
  } = props;
  return (
    <div className="kyc-upload-card" onClick={onClick}>
      <div className="image">
        <img
          src={require(`assets/${productName}/${
            doc_status === "approved" ? approved_image : default_image
          }`)}
          alt={title}
          className="icon"
        />
        {doc_status === "rejected" && (
          <img
            src={require(`assets/attention_icon.svg`)}
            alt=""
            className="check-icon"
          />
        )}
        {doc_status === "submitted" && (
          <img
            src={require(`assets/success_icon.svg`)}
            alt=""
            className="check-icon"
          />
        )}
      </div>
      <div>
        <div className="title">{title}</div>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default UploadCard;
