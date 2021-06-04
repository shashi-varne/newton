import './commonStyles.scss';
import React from "react";
import Webcam from "react-webcam";
import WVButton from "../../common/ui/Button/WVButton";
import WVFullscreenDialog from "../../common/ui/FullscreenDialog/WVFullscreenDialog";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";

const VIDEO_CONSTRAINTS = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamSelfie = ({
  isOpen,
  onClose,
  onCaptureSuccess,
}) => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      const base64Img = webcamRef.current.getScreenshot({
        width: VIDEO_CONSTRAINTS.width,
        height: VIDEO_CONSTRAINTS.height
      });
      onCaptureSuccess(base64Img);
    },
    [webcamRef]
  );

  return (
    <WVFullscreenDialog open={isOpen} onClose={onClose}>
      <WVFullscreenDialog.Content onCloseClick={onClose}>
      <div className="webcam-selfie">
        <WVInPageTitle>Selfie Capture</WVInPageTitle>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={VIDEO_CONSTRAINTS}
          screenshotQuality={1}
        />

      </div>
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <WVButton
          variant="outlined"
          color="secondary"
          onClick={capture}
          classes={{ root: 'webcam-selfie-btn' }}
        >
          Capture Now
        </WVButton>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
};

export default WebcamSelfie;