import React from "react";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import { Button } from "material-ui";

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
    >
      <DialogContent className="know-more-dialog-content">
        <header onClick={close}>
          <SVG
            preProcessor={(code) => code.replace(/fill=".*?"/g, "fill=#8c9ba5")}
            src={require(`assets/close_white_icon.svg`)}
            className="close-icon"
          />
        </header>
        <main>
          <div className="title">How to make a selfie Video?</div>
          <div className="content">
            <div className="text">
              <b>Step 1 - </b> Hold your PAN card and start recording.
            </div>
            <img
              alt="start-recording"
              src={require(`assets/${productName}/start_recording.svg`)}
            />
          </div>
          <div className="content">
            <div className="text">
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
        <Button onClick={close}>GOT IT!</Button>
      </DialogActions>
    </Dialog>
  );
};

export default KnowMore;
