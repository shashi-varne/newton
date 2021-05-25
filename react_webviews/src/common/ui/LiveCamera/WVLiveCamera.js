import './WVLiveCamera.scss';
import { useEffect } from 'react';
import { isEmpty, isFunction } from 'lodash';
import useScript from '../../customHooks/useScript';
import Api from '../../../utils/api';

const SCRIPT_SRC = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/hyperverge-web-sdk@latest/src/sdk.min.js";

const WVLiveCamera = ({
  open,
  title = 'Selfie Capture',
  onClose,
  onCameraInit,
  onCaptureSuccess,
  onCaptureFailure,
  children
}) => {
  const { scriptLoaded } = useScript(SCRIPT_SRC);

  const initHVCamera = async () => {
    try {
      const res = await Api.get('api/kyc/hyperverge/token/fetch');
      if (res.pfwstatus_code !== 200 || isEmpty(res.pfwresponse)) {
        // eslint-disable-next-line no-throw-literal
        throw 'Something went wrong!';
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        window.HyperSnapSDK.init(result.hyperverge_token, window.HyperSnapParams.Region.India);
        window.HyperSnapSDK.startUserSession();
        onCameraInit(true);
      } else {
        throw (result.error || result.message || 'Something went wrong!');
      }
    } catch (err) {
      onCameraInit(false);
      console.log('Error fetching HV token: ', err);
    }
  }

  const openHVCamera = async () => {
    const hvFaceConfig = new window.HVFaceConfig();
    hvFaceConfig.setShouldShowInstructionPage(true);
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
      } else if (isFunction(onCaptureFailure)) {
        onCaptureFailure(HVError);
      }
    } else if (isFunction(onCaptureSuccess)) {
      onCaptureSuccess({
        ...HVResponse.response.result,
        imgBase64: HVResponse.imgBase64
      });
    }
  };

  useEffect(() => {
    if (open && scriptLoaded) {
      openHVCamera();
    }
  }, [open]);

  useEffect(() => {
    if (scriptLoaded) {
      initHVCamera();
    }
  }, [scriptLoaded]);

  return children || '';
}

export default WVLiveCamera;