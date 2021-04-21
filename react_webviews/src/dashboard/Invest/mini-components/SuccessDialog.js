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
      className="invest-redeem-dialog"
      id="invest-bottom-dialog"
      onClose={close}
    >
      <DialogContent className="dialog-content">
        <div className="head-bar">
          <div className="text-left">
            Date{sips.length !== 1 && <>s</>} confirmed
          </div>
          <img
            src={require(`assets/${productName}/ic_date_confirmed.svg`)}
            alt=""
          />
        </div>
        <div className="subtitle text">
          Your monthly SIP investment
          {sips.length !== 1 && <span>s</span>} date
          {sips.length !== 1 && <span>s</span>}
          <span>{sips.length === 1 ? " is " : " are "}</span>
          {sips.map((sip, index) => {
            return (
              <span key={index}>
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
          classes={{ button: "button" }}
          buttonTitle="CONTINUE TO PAYMENT"
        />
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
