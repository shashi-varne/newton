import React from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "utils/functions";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import "./Style.scss";

const product = getConfig().productName;

function VerifyDetailDialog({ type, isOpen, data, onClose }) {
  const editHandle = () => {
    console.log("edit clicked");
  };

  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Verify your ${type} address`}
      image={require(`../../assets/${product}/bottomsheet_verify_${type}.svg`)}
      subtitle={`${
        type === "email" ? "Email" : "Mobile"
      } verification is mandatory for investment as per SEBI`}
      button1Props={{
        type: "primary",
        title: "CONTINUE",
        onClick: () => {
          console.log("DIALOG NEXT");
        },
      }}
      classes={{
        container: "verify-details-container",
      }}
    >
      <div className="details">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={require(`../../assets/bottom_sheet_icon_${type}.svg`)}
            alt=""
          />
          <span className="text">{data}</span>
        </div>
        <WVClickableTextElement onClick={editHandle}>
          EDIT
        </WVClickableTextElement>
      </div>
    </WVBottomSheet>
  );
}

export default VerifyDetailDialog;
