import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import './mini-components.scss';

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
      disableEnforceFocus
      aria-describedby="verification-failed-dialog"
      className="verification-failed-dialog"
      id="invest-bottom-dialog"
      data-aid='invest-bottom-dialog'
    >
      <DialogContent className="verification-failed-dialog-content kyc-premium-content" data-aid='verification-failed-dialog-content'>
        <div className="title" data-aid='dialog-title'>
          <div className="text">{data.popup_header}</div>
          {data.icon && (
            <img
              src={require(`assets/${productName}/${data.icon}`)}
              alt=""
              className="img"
            />
          )}
        </div>
        <div className="subtitle" id="subtitle" data-aid='dialog-subtitle'>
          {data.bold_text && <b>{data.bold_text}</b>} {data.popup_message}
        </div>
        {data.status === "ground_premium" && (
          <div className="vfdc-bottom-info" data-aid='bottom-info'>
            <div className="bottom-info-box">
              <img
                src={require(`assets/${productName}/ic_instant.svg`)}
                alt=""
                className="img"
              />
              <div className="bottom-info-content" data-aid='instant-investment'>Instant investment</div>
            </div>
            <div className="bottom-info-mid"></div>
            <div className="bottom-info-box">
              <img
                src={require(`assets/${productName}/ic_no_doc.svg`)}
                alt=""
                className="img"
              />
              <div className="bottom-info-content" data-aid='no-document-asked'>No document asked</div>
            </div>
          </div>
        )}
        <div className="action">
          {!data.oneButton && (
            <Button className="button no-bg" onClick={() => cancel()} data-aid='not-now-btn'>
              NOT NOW
            </Button>
          )}
          <Button className="button bg-full" onClick={() => handleClick()} data-aid='dialog-btn'>
            {data.button_text}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycPremiumLandingDialog;
