import React from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import Button from "../../common/ui/Button";
import WVFullscreenDialog from "../../common/ui/FullscreenDialog/WVFullscreenDialog";

const config = getConfig();
const productName = config.productName;
const KnowMore = ({ isOpen, close }) => {
  return (
    <WVFullscreenDialog onClose={close} open={isOpen}>
      <WVFullscreenDialog.Content onCloseClick={close}>
        <main
          data-aid="kyc-ipv-videoknowmore"
          className="know-more-dialog-content"
        >
          <div className="title" data-aid="kyc-title">
            How to make a selfie video?
          </div>
          <div className="content">
            <div className="text" data-aid="kyc-content-step-1">
              Before recording ensure you are in a quiet place and your full
              face is visible. Once ready start recording.
            </div>
            <img
              alt="start-recording"
              src={require(`assets/${productName}/start_recording.svg`)}
            />
          </div>
          <div className="content second-step-content">
            <div className="text" data-aid="kyc-content-step-2">
              Say the verification code and stop recording
            </div>
            <img
              alt="start-recording"
              src={require(`assets/${productName}/state_ipv_number.svg`)}
            />
          </div>
        </main>
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <Button
          data-aid="ipv-video-button"
          buttonTitle="OKAY"
          classes={{ button: "kipv-knowmore-button" }}
          onClick={close}
        />
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
};

export default KnowMore;
