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
      classes={{
        container: "account-already-exists-container",
      }}
    >
      <p className="text">
        Your {type === "email" ? "email address" : "mobile number"} is already
        registered with
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div className="details">
          <img
            src={require(`../../../assets/bottom_sheet_icon_${type}.svg`)}
            alt=""
            style={{ paddingRight: "10px" }}
          />
          <span className="text">{data}</span>
        </div>
        <div style={{ flexBasis: "20%" }}>
          <p className="text" style={{ textAlign: "center" }}>
            |
          </p>
        </div>
        <div className="details">
          <img
            src={require(`../../../assets/bottom_sheet_icon_pan.svg`)}
            alt=""
            style={{ paddingRight: "10px" }}
          />
          <span className="text">{pan}</span>
        </div>
      </div>
    </WVBottomSheet>
  );
}

export default AccountAlreadyExistDialog;
