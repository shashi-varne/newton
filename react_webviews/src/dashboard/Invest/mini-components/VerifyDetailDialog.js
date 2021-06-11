import React from "react";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "utils/functions";
import WVClickableTextElement from "../../../common/ui/ClickableTextElement/WVClickableTextElement";
const product = getConfig().productName;

function VerifyDetailDialog({ type, isOpen, data }) {
  const editHandle = () => {
    console.log("edit clicked");
  };

  const onClose = () => {
    console.log("Dialog Closed");
  };

  return (
    <WVBottomSheet
      isOpen={true}
      onClose={onClose}
      title={`Verify your ${type} address`}
      image={require(`../../../assets/${product}/bottomsheet_verify_${type}.svg`)}
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
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={require(`../../../assets/bottom_sheet_icon_${type}.svg`)}
            alt=""
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: "400",
              lineHeight: "21px",
              letterSpacing: "0px",
              color: "#767E86",
              paddingLeft: "10px",
            }}
          >
            {data}
          </span>
        </div>
        <WVClickableTextElement onClick={editHandle}>
          EDIT
        </WVClickableTextElement>
      </div>
    </WVBottomSheet>
  );
}

export default VerifyDetailDialog;
