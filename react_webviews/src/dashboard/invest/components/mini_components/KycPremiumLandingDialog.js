import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";

const KycPremiumLandingDialog = ({
  isOpen,
  close,
  handleClick,
  cancel,
  data,
}) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      aria-labelledby="verification-failed-dialog"
      keepMounted
      aria-describedby="verification-failed-dialog"
      className="verification-failed-dialog"
      id="invest-bottom-dialog"
    >
      <DialogContent className="verification-failed-dialog-content kyc-premium-content">
        <div className="title">
          <div className="text">{data.popup_header}</div>
          {data.icon && (
            <img
              src={require(`assets/${productName}/${data.icon}`)}
              alt=""
              className="img"
            />
          )}
        </div>
        <div className="subtitle" id="subtitle">
          {data.bold_text && <b>{data.bold_text}</b>} {data.popup_message}
        </div>
        {data.status === "ground_premium" && (
          <div className="bottom-info">
            <div className="bottom-info-box">
              <img
                src={require(`assets/${productName}/ic_instant.svg`)}
                alt=""
                className="img"
              />
              <div className="bottom-info-content">Instant investment</div>
            </div>
            <div className="bottom-info-mid"></div>
            <div className="bottom-info-box">
              <img
                src={require(`assets/${productName}/ic_no_doc.svg`)}
                alt=""
                className="img"
              />
              <div className="bottom-info-content">No document asked</div>
            </div>
          </div>
        )}
        <div className="action">
          {!data.oneButton && (
            <Button className="button no-bg" onClick={() => cancel()}>
              NOT NOW
            </Button>
          )}
          <Button className="button bg-full" onClick={() => handleClick()}>
            {data.button_text}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycPremiumLandingDialog;
