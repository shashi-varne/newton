import React from "react";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "utils/functions";
const product = getConfig().productName;

function AccountAlreadyExistDialog({ type, isOpen, onClose, data, pan }) {
  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Account already exists!`}
      image={require(`../../../assets/${product}/bottomsheet_account_exist.svg`)}
      button1Props={{
        type: "secondary",
        title: `EDIT ${type === "email" ? "EMAIL" : "NUMBER"}`,
        onClick: () => {
          console.log("Button1 clicked");
        },
      }}
      button2Props={{
        type: "primary",
        title: "CONTINUE",
        onClick: () => {
          console.log("Button2 clicked");
        },
      }}
    >
      <p className="account-already-exists-text" style={{ paddingTop: "15px" }}>
        Your {type === "email" ? "email address" : "mobile number"} is already
        registered with
      </p>
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
            style={{ paddingRight: "10px" }}
          />
          <span className="account-already-exists-text">{data}</span>
        </div>
        <p className="account-already-exists-text">|</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={require(`../../../assets/bottom_sheet_icon_pan.svg`)}
            alt=""
            style={{ paddingRight: "10px" }}
          />
          <span className="account-already-exists-text">{pan}</span>
        </div>
      </div>
    </WVBottomSheet>
  );
}

export default AccountAlreadyExistDialog;
