import React from "react";
import { getConfig, isTradingEnabled } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { isEquityCompleted } from "../common/functions";

const config = getConfig();
const productName = config.productName;
const PennySuccessDialog = ({ isOpen, redirect }) => {
  const TRADING_ENABLED = isTradingEnabled();
  const isEquityCompletedBase = isEquityCompleted();
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Bank added successfully"
      image={require(`assets/${productName}/ic_bank_verified.svg`)}
      button1Props={{
        title: "CONTINUE",
        onClick: redirect,
        variant: "contained",
      }}
      classes={{
        content: "penny-bank-verification-dialog-content",
      }}
    >
      <div className="generic-page-subtitle penny-bank-verification-dialog-subtitle">
        {(!TRADING_ENABLED || isEquityCompletedBase)
          ? "Hurrah! Your bank account is added. Invest securely and safely with us."
          : "Now, tell us your trading experience in the next step"}
      </div>
    </WVBottomSheet>
  );
};

export default PennySuccessDialog;
