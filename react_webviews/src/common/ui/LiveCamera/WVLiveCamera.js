import './WVLiveCamera.scss';
import { useEffect } from 'react';
import { isEmpty, isFunction } from 'lodash';
import useScript from '../../customHooks/useScript';
import Api from '../../../utils/api';
import { storageService } from '../../../utils/validators';
import { base64ToBlob } from '../../../utils/functions';

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

  const isHVTokenValid = (HVToken) => {
    if (isEmpty(HVToken)) return false;

    const timeElapsed = Date.now() - HVToken.timestamp;
    // If token is more than 10 mins old, invalidate token
    if (timeElapsed > 10*60*1000) {
      return false;
    }

    return true;
  }

  const initHVCamera = async () => {
    try {
      let HVToken = storageService().getObject('HVToken');
      if (!isHVTokenValid(HVToken)) {
        const res = await Api.get('api/kyc/hyperverge/token/fetch');
        if (res.pfwstatus_code !== 200 || isEmpty(res.pfwresponse)) {
          // eslint-disable-next-line no-throw-literal
          throw 'Something went wrong!';
        }
  
        const { result, status_code: status } = res.pfwresponse;
        if (status === 200) {
          HVToken = {
            token: result.hyperverge_token,
            timestamp: Date.now()
          };
          storageService().setObject('HVToken', HVToken);
        } else {
          throw (result.error || result.message || 'Something went wrong!');
        }
      }
      window.HyperSnapSDK.init(HVToken.token, window.HyperSnapParams.Region.India, false, true);
      window.HyperSnapSDK.startUserSession();
      onCameraInit(true);
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
    if (HVError) {
      if (HVError.errorCode === "013") {
        onClose();
      } else if (isFunction(onCaptureFailure)) {
        onCaptureFailure(HVError);
      }
    } else if (isFunction(onCaptureSuccess)) {
      const fileBlob = base64ToBlob(HVResponse.imgBase64.split(",")[1], 'image/jpeg');

      onCaptureSuccess({
        ...HVResponse.response.result,
        fileBlob,
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