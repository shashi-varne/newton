import './commonStyles.scss';
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import WVButton from "../../common/ui/Button/WVButton";
import WVFullscreenDialog from "../../common/ui/FullscreenDialog/WVFullscreenDialog";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { base64ToBlob } from '../../utils/functions';

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
  const [noCameraFound, setNoCameraFound] = useState(false);
  const [noCameraPermission, setNoCameraPermission] = useState(false);
  const [errorContent, setErrorContent] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setNoCameraFound(videoDevices.length === 0);
      });
  }, []);

  useEffect(() => {
    if (noCameraPermission) {
      setErrorContent("Webcam permission is necessary to complete KYC. You can continue on mobile app if you are facing an issue.")
    } else if (noCameraFound) {
      setErrorContent("You do not have a webcam, use mobile app to complete KYC");
    }
  }, [noCameraFound, noCameraPermission])

  const capture = React.useCallback(
    () => {
      const imgBase64 = webcamRef.current.getScreenshot({
        width: VIDEO_CONSTRAINTS.width,
        height: VIDEO_CONSTRAINTS.height
      });

      const fileBlob = base64ToBlob(imgBase64.split(",")[1], 'image/jpeg');
      onCaptureSuccess({
        fileBlob,
        imgBase64
      });
    },
    [webcamRef]
  );

  return (
    <WVFullscreenDialog open={isOpen} onClose={onClose}>
      <WVFullscreenDialog.Content onCloseClick={onClose}>
          <div className="webcam-selfie">
            <WVInPageTitle>Selfie Capture</WVInPageTitle>
            {(noCameraPermission || noCameraFound) ? 
              <WVInfoBubble
                hasTitle
                type="error"
              >
                {errorContent}
              </WVInfoBubble> :
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={VIDEO_CONSTRAINTS}
                screenshotQuality={1}
                onUserMediaError={() => setNoCameraPermission(true)}
              />
            }
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