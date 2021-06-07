import React from "react";
import { getConfig } from "utils/functions";
import "./commonStyles.scss";

const UploadCard = (props) => {
  const productName = getConfig().productName;
  const {
    kyc,
    default_image,
    docKey,
    title,
    onClick,
    subtitle,
    doc_status,
    approved_image,
    index,
  } = props;
  const approvedCondition = (docKey !== "bank" && doc_status === "approved") ||
  (docKey === "bank" && doc_status === "approved" &&
  (kyc?.bank?.meta_data?.bank_status === "doc_submitted" || kyc?.bank?.meta_data?.bank_status === "verified"));
  const submittedCondition = (docKey !== "bank" && doc_status === "submitted") ||
  (docKey === "bank" && doc_status === "submitted" &&
  (kyc?.bank?.meta_data?.bank_status === "submitted"));
  return (
    <div className="kyc-upload-card" data-aid='kyc-upload-card' onClick={onClick}>
      <div className="image">
        <img
          src={require(`assets/${productName}/${
            approvedCondition ? approved_image : default_image
          }`)}
          alt={title}
          className="icon"
          id={`icon${index+1}`}
        />
        {doc_status === "rejected" && (
          <img
            src={require(`assets/attention_icon.svg`)}
            alt=""
            className="check-icon"
            id={`check-icon-rejected_${index+1}`}
          />
        )}
      </div>
      <div>
        <div className="title" id={`title_${index+1}`} data-aid={`title_${index+1}`}>{title}</div>
        {subtitle && <div className="subtitle" id={`subtitle_${index+1}`} data-aid={`subtitle_${index+1}`}>{subtitle}</div>}
      </div>
      {(approvedCondition || submittedCondition) &&
        <img
          src={require(`assets/badge-success.svg`)}
          alt="submitted"
          style={{ marginLeft: 'auto' }}
          id={`check-icon-submitted_${index + 1}`}
        />
      }
    </div>
  );
};

export default UploadCard;
