import './WVLiveCamera.scss';
import { useEffect } from 'react';
import { isFunction } from 'lodash';
import useScript from '../../customHooks/useScript';
import Api from '../../../utils/api';

const SCRIPT_SRC = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/hyperverge-web-sdk@latest/src/sdk.min.js";

const WVLiveCamera = ({
  open,
  title = 'Selfie Capture',
  onClose,
  onSuccess,
  onFailure,
  children
}) => {
  const { scriptLoaded } = useScript(SCRIPT_SRC);

  const initHVCamera = async () => {
    let jwtToken = '';
    try {
      const { result } = await Api.post('https://auth.hyperverge.co/login', {
        "appId": "fd4b70",
        "appKey": "11fa986a43b5328ca2d3",
        "expiry": 12000
      });
      jwtToken = result.token || '';
    } catch (err) {
      console.log('Error fetching HV token: ', err);
    }
    window.HyperSnapSDK.init(jwtToken, window.HyperSnapParams.Region.India);
    window.HyperSnapSDK.startUserSession();
    openHVCamera();
  }

  const openHVCamera = async () => {
    const hvFaceConfig = new window.HVFaceConfig();
    hvFaceConfig.setShouldShowInstructionPage(true);
    hvFaceConfig.setLivenessAPIHeaders({
      "appId": "fd4b70",
      "appKey": "11fa986a43b5328ca2d3",
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
    if (HVError) {
      if (HVError.errorCode === "013") {
        onClose();
      } else if (isFunction(onFailure)) {
        onFailure(HVError);
      }
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
      initHVCamera();
    }
  }, [open, scriptLoaded]);

  return children || '';
}

export default WVLiveCamera;