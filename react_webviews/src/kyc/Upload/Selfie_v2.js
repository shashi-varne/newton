import "./commonStyles.scss";
import React, { useState } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import Toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVLiveCamera from "../../common/ui/LiveCamera/WVLiveCamera";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import LocationPermission from "./LocationPermission";
import WVButton from "../../common/ui/Button/WVButton";

const productName = getConfig().productName;

const SelfieV2 = (props) => {
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
  const { kyc, isLoading } = useUserKycHook();
  const navigate = navigateFunc.bind(props)

  const handleSubmit = async () => {
    try {
      setIsApiRunning("button")
      const result = await upload(file, 'identification', {
        res: fileToShow,
        lat: locationData.lat,
        lng: locationData.lng,
        live_score: selfieLiveScore,
        kyc_product_type: 'equity'
      });
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

  const openLiveCamera = () => {
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

  return (
    <Container
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
          <div className="sub-title">As per SEBI, selfie verification is mandatory to complete KYC</div>
          {/* TODO: Fix styling here as per design */}
          <div className="kyc-upload-selfie-title">
            Face should be clearly visible
          </div>
          <div className="kyc-doc-upload-container with-bg-color">
            {file && fileToShow && (
              <img src={fileToShow} className="preview" alt="" />
            )}
            {!file && (
              <img
                className="kduc-selfie-placeholder"
                src={require(`assets/${productName}/selfie_placeholder.svg`)}
                alt="Upload Selfie"
                width="320px"
              />
            )}
            <div className="kyc-upload-doc-actions">
              <WVButton
                fullWidth
                style={{ backgroundColor: 'white' }}
                showLoader={isCamLoading}
                variant="outlined"
                size="large"
                color="secondary"
                onClick={openLiveCamera}
              >
                {file ? "Retake" : "Open Camera"}
              </WVButton>
            </div>
          </div>
          <div className="kyc-selfie-intructions">
            <span id="kyc-si-text">How to take selfie?</span>
            <WVClickableTextElement onClick={showSelfieSteps}>
              Know More
            </WVClickableTextElement>
          </div>
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
        </section>
      )}
    </Container>
  )
}

export default SelfieV2;
