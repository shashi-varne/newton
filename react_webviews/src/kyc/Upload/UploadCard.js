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
    index,
  } = props;
  return (
    <div className="kyc-upload-card" data-aid='kyc-upload-card' onClick={onClick}>
      <div className="image">
        <img
          src={require(`assets/${productName}/${
            doc_status === "approved" ? approved_image : default_image
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
      {['submitted', 'approved'].includes(doc_status) &&
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
