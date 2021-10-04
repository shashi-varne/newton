import React, { useMemo } from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import Button from "../../common/ui/Button";
import WVFullscreenDialog from "../../common/ui/FullscreenDialog/WVFullscreenDialog";
import { Imgc } from "../../common/ui/Imgc";

const KnowMore = ({ isOpen, close }) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);

  return (
    <WVFullscreenDialog onClose={close} open={isOpen}>
      <WVFullscreenDialog.Content>
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
            <Imgc
              alt="start-recording"
              src={require(`assets/${productName}/start_recording.svg`)}
              className="kyc-kmdc-img"
            />
          </div>
          <div className="content second-step-content">
            <div className="text" data-aid="kyc-content-step-2">
              Say the verification code and stop recording
            </div>
            <Imgc
              alt="start-recording"
              src={require(`assets/${productName}/state_ipv_number.svg`)}
              className="kyc-kmdc-img"
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
