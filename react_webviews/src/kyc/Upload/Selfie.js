import "./commonStyles.scss";
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../common/Container'
import { isEmpty } from '../../utils/validators'
import { PATHNAME_MAPPER, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { checkDocsPending, isDocSubmittedOrApproved, isNotManualAndNriUser } from '../common/functions'
import { getConfig, isTradingEnabled, navigate as navigateFunc } from 'utils/functions'
import Toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVLiveCamera from "../../common/ui/LiveCamera/WVLiveCamera";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import LocationPermission from "./LocationPermission";
import KycUploadContainer from "../mini-components/KycUploadContainer";
import SelfieUploadStatus from "../Equity/mini-components/SelfieUploadStatus";
import { nativeCallback } from '../../utils/native_callback'
import { openFilePicker } from "../../utils/functions";

const config = getConfig();
const { productName, isNative, Web: isWeb, isSdk } = config;

const Selfie = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [file, setFile] = useState(null);
  const [fileToShow, setFileToShow] = useState(null);
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [isLiveCamInitialised, setIsLiveCamInitialised] = useState(false);
  const [isLocnPermOpen, setIsLocnPermOpen] = useState(false);
  const [isLocInitialised, setIsLocInitialised] = useState(true);
  const [locationData, setLocationData] = useState({});
  const [selfieLiveScore, setSelfieLiveScore] = useState('');
  // const [showLoader, setShowLoader] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState('');
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const [isCamLoading, setIsCamLoading] = useState();
  const [isTradingFlow, setIsTradingFlow] = useState(false);
  const [areDocsPending, setDocsPendingStatus] = useState();
  const [fileHandlerParams, setFileHandlerParams] = useState();
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc])

  const initialize = async () => {
    const docStatus = await checkDocsPending(kyc);
    setDocsPendingStatus(docStatus)
    const tradeFlow = isTradingEnabled(kyc);
    const tradingFlow = tradeFlow && kyc.kyc_type !== "manual";
    setIsTradingFlow(tradingFlow);
    setIsCamLoading(tradingFlow);
  }

  const handleNavigation = () => {
    if (bottomSheetType === "failed") {
      setOpenBottomSheet(false)
    } else {
      if (isTradingFlow) {
        if (!isDocSubmittedOrApproved("equity_income")) {
          navigate(PATHNAME_MAPPER.uploadFnOIncomeProof);
        } else {
          if (areDocsPending) {
            navigate(PATHNAME_MAPPER.documentVerification);
          } else {
            navigate(PATHNAME_MAPPER.kycEsign);
          }
        }
      } else {
        navigate(PATHNAME_MAPPER.uploadProgress);
      }
    }
  }

  const handleSubmit = async () => {
    sendEvents('next');

    if (bottomSheetType === "failed") {
      setBottomSheetType("");
    }
    try {
      if (parseFloat(selfieLiveScore) < 0.8) {
        // eslint-disable-next-line no-throw-literal
        throw 'Live score too low';
      }

      let params = {
        lat: locationData?.lat,
        lng: locationData?.lng,
      };

      if (isTradingFlow) {
        params = {
          ...params,
          live_score: selfieLiveScore,
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
      setIsApiRunning(false)
    }
  }

  const showSelfieSteps = () => {
    navigate(PATHNAME_MAPPER.selfieSteps);
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
  }, [isLiveCamInitialised, isLocInitialised]);

  // Used for Button click in Web
  const openLiveCamera = () => {
    if (isLiveCamInitialised) {
      setIsLocnPermOpen(true);
    }
  }
  
  // Used for Button click in Native
  const onOpenCameraClick = (...params) => {
    setFileHandlerParams(params);
    setIsLocnPermOpen(true);
  }

  const onLocationFetchSuccess = (data) => {
    setLocationData(data);
    closeLocnPermDialog();
    if (!isNative) {
      setIsLiveCamOpen(true);
    } else if (fileHandlerParams.length) {
      openFilePicker(...fileHandlerParams);
    }
  }

  const onCaptureSuccess = async (...resultParams) => {
    if (isWeb) {
      setIsLiveCamOpen(false);
      
      const [result] = resultParams;
      if (result.imgBase64 && result['liveness-score']) {
        setFile(result.fileBlob);
        setFileToShow(result.imgBase64);
        setSelfieLiveScore(result['liveness-score']);
      } else {
        onCaptureFailure();
      }
    } else {
      const [file, fileBase64, otherParams] = resultParams;
      setFile(file);
      setFileToShow(fileBase64);
      if (otherParams?.liveness_result) {
        setSelfieLiveScore(otherParams.liveness_result['liveness-score']);
      }
    }
  }

  const onCaptureFailure = (error) => {
    setIsLiveCamOpen(false);

    const defaultMsg = 'Something went wrong! Please try again';
    if (['010', 'liveness-error'].includes(error?.errorCode)) {
      return Toast(error.errorMsg || defaultMsg);
    }
    Toast(defaultMsg);
  }

  const closeLocnPermDialog = (locationCloseType) => {
    if (locationCloseType === 'invalid-region') {
      navigate(PATHNAME_MAPPER.journey);
    }
    setIsLocnPermOpen(false);
  }

  const sendEvents = (userAction, type) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "selfie_doc",
        "type": type || "",
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const renderButton = useCallback(() => {
    let buttonProps = {};
    if (isWeb) {
      Object.assign(buttonProps, {
        showLoader: isCamLoading,
        onClick: openLiveCamera
      });
    } else {
      buttonProps = {
        withPicker: true,
        nativePickerMethodName: 'open_camera',
        fileName: 'selfie',
        supportedFormats: SUPPORTED_IMAGE_TYPES,
        onFileSelectComplete: onCaptureSuccess,
        onFileSelectError: onCaptureFailure,
      }
      if (isNative) {
        // To trigger HyperVerge's Live Camera in Native
        buttonProps.fileHandlerParams = { check_liveness: true };
        buttonProps.customClickHandler = onOpenCameraClick;
      }
    }

    return (
      <KycUploadContainer.Button {...buttonProps}>
        {file ? "Retake" : "Open Camera"}
      </KycUploadContainer.Button>
    );
  }, [isCamLoading]);

  return (
    <Container
      buttonTitle="Upload"
      skelton={isLoading}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Take a selfie"
      data-aid='kyc-upload-selfie-screen'
      events={sendEvents("just_set_events")}
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
            {renderButton()}
          </KycUploadContainer>
          <div className="kyc-selfie-intructions">
            <span id="kyc-si-text">How to take selfie?</span>
            <WVClickableTextElement onClick={showSelfieSteps}>
              Know More
            </WVClickableTextElement>
          </div>
          {isWeb &&
            <WVLiveCamera
              open={isLiveCamOpen}
              onCameraInit={onCameraInit}
              onClose={() => setIsLiveCamOpen(false)}
              onCaptureFailure={onCaptureFailure}
              onCaptureSuccess={onCaptureSuccess}
            />
          }
          {!isSdk &&
            <>
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
            disableBackdropClick
            onClose={() => setOpenBottomSheet(false)}
            onCtaClick={handleNavigation}
          />
        </section>
      )}
    </Container>
  )
}

export default Selfie;
