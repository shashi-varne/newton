import React from "react";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "common/ui/Button";
import { dateOrdinal } from "utils/validators";
import "./mini-components.scss";
import "../commonStyles.scss";

const SuccessDialog = ({ isOpen, handleClick, sips = [], close }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="success-dialog"
      keepMounted
      aria-describedby="success-dialog"
      className="invest-common-dialog"
      id="invest-bottom-dialog"
      data-aid='invest-bottom-dialog'
      onClose={close}
    >
      <DialogContent className="dialog-content" data-aid='dialog-content'>
        <div className="head-bar" data-aid='head-bar'>
          <div className="text-left">
            Date{sips.length !== 1 && <>s</>} confirmed
          </div>
          <img
            src={require(`assets/${productName}/ic_date_confirmed.svg`)}
            alt=""
          />
        </div>
        <div className="subtitle success-text-message" data-aid='success-text-message'>
          Your monthly SIP investment
          {sips.length !== 1 && <span>s</span>} date
          {sips.length !== 1 && <span>s</span>}
          <span>{sips.length === 1 ? " is " : " are "}</span>
          {sips.map((sip, index) => {
            return (
              <span key={index} data-aid={`sips-${index+1}`}>
                {index === sips.length - 1 && index !== 0 && (
                  <span>&nbsp;and</span>
                )}
                <b>&nbsp;{dateOrdinal(sip.sip_date)}</b>
                {sips.length > 1 &&
                  index !== sips.length - 1 &&
                  index !== sips.length - 2 && <span>, </span>}
              </span>
            );
          })}
          &nbsp;of every month. Automate your SIP registration with easySIP.
        </div>
      </DialogContent>
      <DialogActions className="action">
        <Button
          onClick={handleClick}
          classes={{ button: "invest-dialog-button" }}
          buttonTitle="CONTINUE TO PAYMENT"
          dataAid='continue-to-payment'
        />
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
