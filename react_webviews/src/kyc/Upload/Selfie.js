import "./commonStyles.scss";
import React, { useEffect, useState } from 'react'
import Container from '../common/Container'
import { isEmpty } from '../../utils/validators'
import { PATHNAME_MAPPER } from '../constants'
import { upload } from '../common/api'
import { isDocSubmittedOrApproved, isNotManualAndNriUser, navigate as navigateFunc } from '../common/functions'
import { getConfig, isTradingEnabled } from 'utils/functions'
import Toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVLiveCamera from "../../common/ui/LiveCamera/WVLiveCamera";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import LocationPermission from "./LocationPermission";
import KycUploadContainer from "../mini-components/KycUploadContainer";
import SelfieUploadStatus from "../Equity/mini-components/SelfieUploadStatus";
import WebcamSelfie from "./WebcamSelfie";

const config = getConfig();
const { productName } = config;
const TRADING_ENABLED = isTradingEnabled();

const Selfie = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [file, setFile] = useState(null);
  const [fileToShow, setFileToShow] = useState(null);
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isLiveCamInitialised, setIsLiveCamInitialised] = useState(false);
  const [isLocnPermOpen, setIsLocnPermOpen] = useState(false);
  const [isLocInitialised, setIsLocInitialised] = useState(true);
  const [locationData, setLocationData] = useState({});
  const [selfieLiveScore, setSelfieLiveScore] = useState('');
  // const [showLoader, setShowLoader] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState('');
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const TRADING_FLOW = TRADING_ENABLED && kyc.kyc_type !== "manual";
  const [isCamLoading, setIsCamLoading] = useState(TRADING_FLOW);
  
  const navigate = navigateFunc.bind(props)
  
  const handleNavigation = () => {
    if (bottomSheetType === "failed") {
      setOpenBottomSheet(false)
    } else {
      if (TRADING_FLOW) {
        if (!isDocSubmittedOrApproved("equity_income"))
          navigate(PATHNAME_MAPPER.uploadFnOIncomeProof);
        else navigate(PATHNAME_MAPPER.kycEsign)
      } else {
        navigate(PATHNAME_MAPPER.uploadProgress);
      }
    }
  }

  const handleSubmit = async () => {
    if (bottomSheetType === "failed") {
      setBottomSheetType("");
    }     
    try { 
      let params = {};
      if (TRADING_FLOW) {
        params = {
          lat: locationData?.lat,
          lng: locationData?.lng,
          live_score: selfieLiveScore,
          kyc_product_type: 'equity'
        };
      }

      if (TRADING_ENABLED && kyc.kyc_type === "manual") {
        params = {
          forced: true,
          kyc_product_type: 'equity'
        };
      }

      setIsApiRunning("button");
      const result = await upload(file, 'identification', params);
      updateKyc(result.kyc);
      if (isNotManualAndNriUser(result.kyc)) {
        setBottomSheetType('success');
        setOpenBottomSheet(true);
      } else {
        handleNavigation();
      }
    } catch (err) {
      console.error(err);
      setBottomSheetType('failed');
      setOpenBottomSheet(true);
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

  const openWebcam = () => {
    setIsWebcamOpen(true);
  }

  const openLiveCamera = () => {
    if (isLiveCamInitialised) {
      setIsLocnPermOpen(true);
    }
  }

  const onCaptureSuccess = async (result) => {
    if (TRADING_FLOW) {
      setIsLiveCamOpen(false);
      if (result.imgBase64 && result['liveness-score']) {
        setFile(result.imgBase64);
        setFileToShow(result.imgBase64);
        setSelfieLiveScore(result['liveness-score']);
      }
    } else {
      setIsWebcamOpen(false);
      setFile(result);
      setFileToShow(result);
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
      setIsLiveCamInitialised(true);
    } else {
      Toast('Something went wrong! Please try again in some time');
    }
  }

  useEffect(() => {
    if (isLiveCamInitialised && isLocInitialised) {
      setIsCamLoading(false);
    }
  }, [isLiveCamInitialised, isLocInitialised])

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
            <KycUploadContainer.Button
              onClick={TRADING_FLOW ? openLiveCamera : openWebcam} /* For SDK users, we currently do not use LiveCamera or Location */
              showLoader={isCamLoading}
            >
              {file ? "Retake" : "Open Camera"}
            </KycUploadContainer.Button>
          </KycUploadContainer>
          <div className="kyc-selfie-intructions">
            <span id="kyc-si-text">How to take selfie?</span>
            <WVClickableTextElement onClick={showSelfieSteps}>
              Know More
            </WVClickableTextElement>
          </div>
          {TRADING_FLOW ?
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
            </> :
            <WebcamSelfie
              isOpen={isWebcamOpen}
              onClose={() => setIsWebcamOpen(false)}
              onCaptureSuccess={onCaptureSuccess}
            />
          }
          <SelfieUploadStatus
            status={bottomSheetType}
            isOpen={openBottomSheet}
            onClose={() => setOpenBottomSheet(false)}
            onCtaClick={handleNavigation}
          />
        </section>
      )}
    </Container>
  )
}

export default Selfie;
