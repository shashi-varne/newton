import './WVLiveCamera.scss';
import { useEffect } from 'react';
import { isEmpty, isFunction } from 'lodash';
import useScript from '../../customHooks/useScript';
import Api from '../../../utils/api';
import Toast from '../Toast';

const SCRIPT_SRC = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/hyperverge-web-sdk@latest/src/sdk.min.js";

const WVLiveCamera = ({
  open,
  title = 'Selfie Capture',
  onClose,
  onCameraLoaded,
  onSuccess,
  onFailure,
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
        openHVCamera();
      } else {
        throw (result.error || result.message || 'Something went wrong!');
      }
    } catch (err) {
      console.log('Error fetching HV token: ', err);
      Toast('Something went wrong! Please go back and try again');
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
  }, [open]);

  useEffect(() => {
    if (scriptLoaded) {
      onCameraLoaded();
    }
  }, [scriptLoaded]);

  return children || '';
}

export default WVLiveCamera;