import "./commonStyles.scss";
import React, { useState } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import Toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'
import WVLiveCamera from "../../common/ui/LiveCamera/WVLiveCamera";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import LocationPermission from "./LocationPermission";
import KycUploadContainer from "../mini-components/KycUploadContainer";

const config = getConfig();
const { productName, isSdk } = config;

const Selfie = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [file, setFile] = useState(null);
  const [fileToShow, setFileToShow] = useState(null);
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [isCamInitialised, setIsCamInitialised] = useState(false);
  const [isCamLoading, setIsCamLoading] = useState(true);
  const [isLocnPermOpen, setIsLocnPermOpen] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [selfieLiveScore, setSelfieLiveScore] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { kyc, isLoading } = useUserKycHook();
  const navigate = navigateFunc.bind(props)

  const handleSubmit = async () => {
    sendEvents("next");
    try {      
      let params = {};
      if (!isSdk) {
        params = {
          lat: locationData?.lat,
          lng: locationData?.lng,
          live_score: selfieLiveScore,
          kyc_product_type: 'equity'
        };
      }

      setIsApiRunning("button");
      const result = await upload(file, 'identification', params);
      storageService().setObject(storageConstants.KYC, result.kyc)
      navigate('/kyc/upload/progress')
    } catch (err) {
      console.error(err)
    } finally {
      console.log('uploaded')
      setIsApiRunning(false)
    }
  }

  const onLocationFetchSuccess = (data) => {
    setLocationData(data);
    closeLocnPermDialog();
    setIsLiveCamOpen(true);
  }

  const onFileSelectComplete = (newFile, fileBase64) => {
    setFile(newFile);
    setFileToShow(fileBase64);
  }

  const onFileSelectError = () => {
    Toast('Please select image file only');
  }

  const openLiveCamera = () => {
    setAttempt(attempt + 1);
    if (isCamInitialised) {
      setIsLocnPermOpen(true);
    }
  }

  const onCaptureSuccess = async (result) => {
    setIsLiveCamOpen(false);
    if (result.imgBase64 && result['liveness-score']) {
      setFile(result.imgBase64);
      setFileToShow(result.imgBase64);
      setSelfieLiveScore(result['liveness-score']);
    }
  }

  const onCaptureFailure = (error) => {
    setIsLiveCamOpen(false);
    Toast(error.errorMsg || 'Something went wrong!');
  }

  const showSelfieSteps = () => {
    navigate('/kyc/upload/selfie-steps');
  }

  const closeLocnPermDialog = () => {
    setIsLocnPermOpen(false);
  }

  const onCameraInit = (init) => {
    setIsCamLoading(false);
    if (init) {
      setIsCamInitialised(true);
    } else {
      Toast('Something went wrong! Please try again in some time');
    }
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      // "event_name": 'KYC_registration',
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "take_a_selfie",
        attempt: attempt
        // "type": type || "",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="Upload"
      skelton={isLoading || showLoader}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Take a selfie"
    >
      {/* TODO: Create a header title/subtitle component to be used everywhere */}
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan">
          <div className="sub-title">
            As per SEBI, selfie verification is mandatory to complete KYC
          </div>
          <KycUploadContainer
            titleText="Face should be clearly visible"
          >
            <KycUploadContainer.Image
              fileToShow={fileToShow}
              illustration={require(`assets/${productName}/selfie_placeholder.svg`)}
            />
            {/* For SDK users, we currently do not use LiveCamera or Location */}
            {isSdk ?
              <KycUploadContainer.Button
                withPicker
                showOptionsDialog
                nativePickerMethodName="open_gallery"
                fileName="pan"
                onFileSelectComplete={onFileSelectComplete}
                onFileSelectError={onFileSelectError}
                supportedFormats={SUPPORTED_IMAGE_TYPES}
              >
                {file ? "Retake" : "Open Camera"}
              </KycUploadContainer.Button> :
              <KycUploadContainer.Button
                onClick={openLiveCamera}
                showLoader={isCamLoading}
              >
                {file ? "Retake" : "Open Camera"}
              </KycUploadContainer.Button>
            }
          </KycUploadContainer>
          <div className="kyc-selfie-intructions">
            <span id="kyc-si-text">How to take selfie?</span>
            <WVClickableTextElement onClick={showSelfieSteps}>
              Know More
            </WVClickableTextElement>
          </div>
          {!isSdk &&
            <>
              <WVLiveCamera
                open={isLiveCamOpen}
                onCameraInit={onCameraInit}
                onClose={() => setIsLiveCamOpen(false)}
                onCaptureFailure={onCaptureFailure}
                onCaptureSuccess={onCaptureSuccess}
              />
              <LocationPermission
                isOpen={isLocnPermOpen}
                onClose={closeLocnPermDialog}
                onLocationFetchSuccess={onLocationFetchSuccess}
                parentProps={props}
              />
            </>
          }
        </section>
      )}
    </Container>
  )
}

export default Selfie;
