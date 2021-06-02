import "./commonStyles.scss";
import React, { useEffect, useState } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import Toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVLiveCamera from "../../common/ui/LiveCamera/WVLiveCamera";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import LocationPermission from "./LocationPermission";
import KycUploadContainer from "../mini-components/KycUploadContainer";
import SelfieUploadStatus from "../Equity/mini-components/SelfieUploadStatus";

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
  const [isLocInitialised, setIsLocInitialised] = useState(true);
  const [locationData, setLocationData] = useState({});
  const [selfieLiveScore, setSelfieLiveScore] = useState('');
  // const [showLoader, setShowLoader] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState('');
  const { kyc, isLoading } = useUserKycHook();
  const navigate = navigateFunc.bind(props)

  const handleSubmit = async () => {
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
      storageService().setObject(storageConstants.KYC, result.kyc);
      setBottomSheetType('success');
    } catch (err) {
      console.error(err);
      setBottomSheetType('failed');
    } finally {
      setOpenBottomSheet(true);
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

  const closeLocnPermDialog = (locationCloseType) => {
    if (locationCloseType === 'invalid-region') {
      navigate('/kyc/journey');
    }
    setIsLocnPermOpen(false);
  }

  const onLocationInit = () => {
    setIsLocInitialised(true);
  }

  const onCameraInit = (init) => {
    setIsCamLoading(false);
    if (init) {
      setIsCamInitialised(true);
    } else {
      Toast('Something went wrong! Please try again in some time');
    }
  }

  useEffect(() => {
    if (isCamInitialised && isLocInitialised) {
      setIsCamLoading(false);
    }
  }, [isCamInitialised, isLocInitialised])

  return (
    <Container
      buttonTitle="Upload"
      skelton={isLoading}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Take a selfie"
    >
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
                onInit={onLocationInit}
                onClose={closeLocnPermDialog}
                onLocationFetchSuccess={onLocationFetchSuccess}
                parentProps={props}
              />
            </>
          }
          <SelfieUploadStatus
            status={bottomSheetType}
            isOpen={openBottomSheet}
            onClose={() => openBottomSheet(false)}
            onCtaClick={() => navigate('/kyc/upload/progress')}
          />
        </section>
      )}
    </Container>
  )
}

export default Selfie;
