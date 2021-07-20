import "./commonStyles.scss";
import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import { isEmpty } from '../../utils/validators'
import { PATHNAME_MAPPER, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig, isTradingEnabled, navigate as navigateFunc } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { checkDocsPending, isDigilockerFlow, isDocSubmittedOrApproved } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import KycUploadContainer from '../mini-components/KycUploadContainer'
import PanUploadStatus from "../Equity/mini-components/PanUploadStatus";
import { nativeCallback } from '../../utils/native_callback'

const config = getConfig();
const productName = config.productName;

const Pan = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [dlFlow, setDlFlow] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState('');
  const {kyc, isLoading, updateKyc} = useUserKycHook();
  const [areDocsPending, setDocsPendingStatus] = useState();
  const [tradingEnabled, setTradingEnabled] = useState();
  const [isPanAvailable, setIsPanAvailable] = useState(false);

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = async () => {
    if (isDigilockerFlow(kyc)) {
      setDlFlow(true);
    }
    const docStatus = await checkDocsPending(kyc);
    setDocsPendingStatus(docStatus);
    setTradingEnabled(isTradingEnabled(kyc))
    setIsPanAvailable(isDocSubmittedOrApproved("equity_pan"));
  }

  const onFileSelectComplete = (newFile, fileBase64) => {
    sendEvents("attach_document");
    setFile(newFile);
    setFileToShow(fileBase64);
  }

  const onFileSelectError = (error) => {
    sendEvents("attach_document");
    toast('Please select image file only');
  }

  const commonRedirection = () => {
    if (!isDocSubmittedOrApproved("equity_identification")) {
      navigate(PATHNAME_MAPPER.uploadSelfie);
    } else {
      if (!isDocSubmittedOrApproved("equity_income")) {
        navigate(PATHNAME_MAPPER.uploadFnOIncomeProof);
      } else {
        if (areDocsPending) {
          navigate(PATHNAME_MAPPER.documentVerification);
        } else {
          navigate(PATHNAME_MAPPER.kycEsign);
        }
      }
    }
  }

  const handleOtherPlatformNavigation = () => {
    if (kyc.kyc_status === 'compliant') {
      commonRedirection();
    } else {
      if (dlFlow) {
        if (kyc.equity_sign_status !== 'signed') {
          if (isPanAvailable && !kyc.equity_data.meta_data.trading_experience) {
            navigate(PATHNAME_MAPPER.tradingExperience);
          } else {
            commonRedirection();
          }
        } else {
          navigate(PATHNAME_MAPPER.journey);
        }
      } else {
        navigate(PATHNAME_MAPPER.uploadProgress);
      }
    }
  };

  const handleSdkNavigation = () => {
    if (dlFlow) {
      navigate('/kyc-esign/info')
    } else {
      navigate('/kyc/upload/progress')
    }
  };

  const handleNavigation = () => {
    sendEvents("next", "pan_uploaded")
    if (tradingEnabled) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  }

  const handleSubmit = async () => {
    sendEvents('next')
    try {
      const data = {};
      if (dlFlow) {
        if ([null, "", "failed"].includes(kyc.all_dl_doc_statuses.pan_fetch_status)) {
          data.kyc_flow =  'dl';
        }
      }
      setIsApiRunning("button")
      const result = await upload(file, 'pan', data);
      if (
        (result.pan_ocr && !result.pan_ocr.ocr_pan_kyc_matches) ||
        (result.error && !result.ocr_pan_kyc_matches)
      ) {
        setBottomSheetType('failed');
        setIsOpen(true);
      } else {
        if(!isEmpty(result)) {
          updateKyc(result.kyc)
        }
        setBottomSheetType('success');
        setIsOpen(true);
      }
    } catch (err) {
      toast(err?.message)
      console.error(err)
    } finally {
      setIsApiRunning(false)
    }
  }

  const handleCloseBottomSheet = () => {
    setIsOpen(false);
  }

  const handleRetryClick = () => {
    sendEvents("next", "pan_details_mismatch");
    handleCloseBottomSheet();
    setFile(null);
    setFileToShow(null);
  }

  const sendEvents = (userAction, screenName) => {
    let eventObj = {
      "event_name": tradingEnabled ? 'trading_onboarding' : 'kyc_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": screenName || "upload_pan",
        // "type": type || "",
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      events={sendEvents("just_set_events")}
      classOverRideContainer="pr-container"
      skelton={isLoading}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Upload PAN"
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
      data-aid='kyc-upload-pan-screen'
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan" data-aid='kyc-upload-pan'>
          <div className="sub-title" data-aid='kyc-sub-title'>
            PAN Card: {kyc?.pan?.meta_data?.pan_number}
          </div>
          {/* {file && subTitle && <Alert
            dataAid='kyc-upload-pan-alertbox'
            variant="attention"
            title={title}
            message={subTitle}
          />} */}
          <KycUploadContainer
            titleText="Your PAN card should be clearly visible in your pic"
          >
            <KycUploadContainer.Image
              fileToShow={fileToShow}
              illustration={require(`assets/${productName}/pan_card.svg`)}
            />
            <KycUploadContainer.Button
              withPicker
              filePickerProps={{
                showOptionsDialog: true,
                shouldCompress: true,
                nativePickerMethodName: "open_gallery",
                fileName: "pan",
                onFileSelectComplete: onFileSelectComplete,
                onFileSelectError: onFileSelectError,
                supportedFormats: SUPPORTED_IMAGE_TYPES
              }}
            />
          </KycUploadContainer>
          <div className="doc-upload-note-row" data-aid='doc-upload-note-row'>
            <div className="upload-note" data-aid='upload-note-text'> How to take picture of your PAN document? </div>
            <WVClickableTextElement
              color="secondary"
              className="know-more-button"
              onClick={() => navigate("/kyc/upload-instructions", {
                state: { document: "pan" }
              })}
            >
              KNOW MORE
            </WVClickableTextElement>
          </div>
          {bottomSheetType &&
            <PanUploadStatus
              status={bottomSheetType}
              isOpen={isOpen}
              onClose={handleCloseBottomSheet}
              disableBackdropClick
              onCtaClick={bottomSheetType === "success" ? handleNavigation : handleRetryClick}
              kyc={kyc}
            />
          }
        </section>
      )}
    </Container>
  );
}

export default Pan
