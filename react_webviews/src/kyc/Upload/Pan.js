import "./commonStyles.scss";
import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import Alert from '../mini-components/Alert'
import { isEmpty } from '../../utils/validators'
import { PATHNAME_MAPPER, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig, isTradingEnabled } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { isDigilockerFlow, isDocSubmittedOrApproved, isNotManualAndNriUser, navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import KycUploadContainer from '../mini-components/KycUploadContainer'
import PanUploadStatus from "../Equity/mini-components/PanUploadStatus";
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'

const config = getConfig();
const productName = config.productName;
const TRADING_ENABLED = isTradingEnabled();

const Pan = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [dlFlow, setDlFlow] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState('');
  const {kyc, isLoading, updateKyc} = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      if (isDigilockerFlow(kyc)) {
        setDlFlow(true);
      }
    }
  }, [kyc]);

  const onFileSelectComplete = (newFile, fileBase64) => {
    setFile(newFile);
    setFileToShow(fileBase64);
  }

  const onFileSelectError = (error) => {
    toast('Please select image file only');
  }

  const handleOtherPlatformNavigation = () => {
    if (kyc.kyc_status === 'compliant') {
      if (!isDocSubmittedOrApproved("identification"))
        navigate(PATHNAME_MAPPER.uploadSelfie);
      else {
        if (!isDocSubmittedOrApproved("equity_income"))
          navigate(PATHNAME_MAPPER.uploadFnOIncomeProof);
        else navigate(PATHNAME_MAPPER.kycEsign)
      }
    } else {
      if (dlFlow) {
        if (kyc.sign_status !== 'signed') {
          navigate(PATHNAME_MAPPER.tradingExperience);
        } else {
          navigate(PATHNAME_MAPPER.journey);
        }
      } else navigate(PATHNAME_MAPPER.uploadProgress);
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
    if (TRADING_ENABLED) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  }

  const handleSubmit = async () => {
    if (isOpen) setIsOpen(false)
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
        if (isNotManualAndNriUser(result.kyc)) {
          setBottomSheetType('success');
          setIsOpen(true);
        } else {
          handleNavigation();
        }
      }
    } catch (err) {
      toast(err?.message)
      console.error(err)
    } finally {
      setIsApiRunning(false)
    }
  }

  const sendEvents = (userAction, type) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "pan_doc",
        "type": type || "",
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
              showOptionsDialog
              nativePickerMethodName="open_gallery"
              fileName="pan"
              onFileSelectComplete={onFileSelectComplete}
              onFileSelectError={onFileSelectError}
              supportedFormats={SUPPORTED_IMAGE_TYPES}
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
          {TRADING_ENABLED && kyc.kyc_type !== "manual" &&
            <PanUploadStatus
              status={bottomSheetType}
              isOpen={isOpen}
              onCtaClick={bottomSheetType === "success" ? handleNavigation : handleSubmit}
            />
          }
        </section>
      )}
    </Container>
  )
}

export default Pan
