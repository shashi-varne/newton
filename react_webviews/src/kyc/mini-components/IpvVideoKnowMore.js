import React from "react";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import Button from "common/ui/Button";
import "./mini-components.scss";

const KnowMore = ({ isOpen, close }) => {
  const config = getConfig();
  const productName = config.productName;

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="ipv-know-dialog"
      aria-describedby="ipv-know-more-dialog"
      className="ipv-know-more-dialog"
      fullScreen={config.isMobileDevice}
      data-aid='ipv-know-more-dialog'
    >
      <DialogContent className="know-more-dialog-content">
        <header onClick={close}>
          <SVG
            preProcessor={(code) => code.replace(/fill=".*?"/g, "fill=#8c9ba5")}
            src={require(`assets/close_white_icon.svg`)}
            className="close-icon"
          />
        </header>
        <main data-aid='kyc-ipv-videoknowmore'>
          <div className="title" data-aid='kyc-title'>How to make a selfie Video?</div>
          <div className="content">
            <div className="text" data-aid='kyc-content-step-1'> 
              <b>Step 1 - </b> Hold your PAN card and start recording.
            </div>
            <img
              alt="start-recording"
              src={require(`assets/${productName}/start_recording.svg`)}
            />
          </div>
          <div className="content">
            <div className="text" data-aid='kyc-content-step-2'>
              <b>Step 2 - </b> Say your Name and stop recording video
            </div>
            <img
              alt="start-recording"
              src={require(`assets/${productName}/state_ipv_number.svg`)}
            />
          </div>
        </main>
      </DialogContent>
      <DialogActions className="action">
        <Button classes={{button: "ipv-km-button"}} data-aid='got-it-btn' onClick={close} buttonTitle="GOT IT!" >GOT IT!</Button>
      </DialogActions>
    </Dialog>
  );
};

export default KnowMore;
