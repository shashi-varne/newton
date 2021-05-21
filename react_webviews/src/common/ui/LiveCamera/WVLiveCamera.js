import './WVLiveCamera.scss';
import { useEffect } from 'react';
import { isFunction } from 'lodash';
import useScript from '../../customHooks/useScript';

const SCRIPT_SRC = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/hyperverge-web-sdk@latest/src/sdk.min.js";

const WVLiveCamera = ({
  open,
  title = 'Selfie Capture',
  onSuccess,
  onFailure
}) => {
  const { scriptLoaded } = useScript(SCRIPT_SRC);

  const checkLiveness = () => {
    const hvFaceConfig = new window.HVFaceConfig();
    // hvFaceConfig.setShouldShowInstructionPage(true);
    hvFaceConfig.setLivenessAPIHeaders({
      "appId": "fd4b70",
      "appKey": "11fa986a43b5328ca2d3",
      "expiry": 12000 // in seconds
    });
    hvFaceConfig.setLivenessAPIParameters({
      rejectFaceMask: 'yes',
      allowEyesClosed: 'no',
      allowMultipleFaces: 'no',
    });
    hvFaceConfig.faceTextConfig.setFaceCaptureTitle(title);
    window.HVFaceModule.start(hvFaceConfig, callback);
  }

  const callback = (HVError, HVResponse) => {
    console.log(HVError, HVResponse);
    if (HVError && isFunction(onFailure)) {
      onFailure(HVError);
    } else if (isFunction(onSuccess)) {
      onSuccess({
        ...HVResponse.response.result,
        imgBase64: HVResponse.imgBase64
      });
    }
  };

  useEffect(() => {
    // TODO: Check how to solve script loading time diff issue
    if (open && scriptLoaded) {
      if (window.HyperSnapSDK) {
        // TODO: Figure out issue with jwtToken fetch
        let jwtToken = ''
        window.HyperSnapSDK.init(jwtToken, window.HyperSnapParams.Region.India);
        window.HyperSnapSDK.startUserSession();
        checkLiveness();
      }
    }
  }, [open, scriptLoaded]);

  return '';
}

export default WVLiveCamera;