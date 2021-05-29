import "./commonStyles.scss";
import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import Alert from '../mini-components/Alert'
import { storageService, isEmpty } from '../../utils/validators'
import { getPathname, storageConstants, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig, isTradingEnabled } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'
import KycUploadContainer from '../mini-components/KycUploadContainer'
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet'

const config = getConfig();
const productName = config.productName;

const Pan = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [title, setTitle] = useState("Note")
  const [subTitle, setSubTitle] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isUploadSuccess, setIsUploadSuccess] = useState(false)
  const [isUploadError, setIsUploadError] = useState(false)
  const [bottomSheetImage, setBottomSheetImage] = useState(null)
  const [dlFlow, setDlFlow] = useState(false);
  const {kyc, isLoading, updateKyc} = useUserKycHook();

  useEffect(() => {
    if (
      !isEmpty(kyc) &&
      kyc.kyc_status !== "compliant" &&
      !kyc.address.meta_data.is_nri &&
      kyc.dl_docs_status !== "" &&
      kyc.dl_docs_status !== "init" &&
      kyc.dl_docs_status !== null
    ) {
      setDlFlow(true);
    }
  }, [kyc]);

  const onFileSelectComplete = (newFile, fileBase64) => {
    sendEvents("attach_document");
    setFile(newFile);
    setFileToShow(fileBase64);
  }

  const onFileSelectError = (error) => {
    sendEvents("attach_document");
    toast('Please select image file only');
  }

  const handleOtherPlatformNavigation = () => {
    if (kyc.kyc_status === 'compliant') {
      if (kyc.equity_identification.doc_status !== "submitted" || kyc.equity_identification.doc_status !== "approved")
        navigate(getPathname.uploadSelfie);
      else {
        if (kyc.equity_income.doc_status !== "submitted" || kyc.equity_income.doc_status !== "approved")
          navigate(getPathname.uploadFnOIncomeProof);
        else navigate(getPathname.kycEsign)
      }
    } else {
      if (dlFlow) {
        if (kyc.sign_status !== 'signed') {
          navigate(getPathname.tradingExperience);
        } else {
          navigate(getPathname.journey);
        }
      } else navigate(getPathname.uploadProgress);
    }
  };

  const handleSdkNavigation = () => {
    if (
      kyc.kyc_status !== 'compliant' &&
      kyc.dl_docs_status !== '' &&
      kyc.dl_docs_status !== 'init' &&
      kyc.dl_docs_status !== null
    ) {
      navigate('/kyc-esign/info')
    } else {
      navigate('/kyc/upload/progress')
    }
  };

  const handleNavigation = () => {
    sendEvents("next", "pan_uploaded")
    if (isTradingEnabled()) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  }

  const handleSubmit = async () => {
    if (isOpen) {
      sendEvents("next", "pan_details_mismatch")
      setIsOpen(false)
    } else {
      sendEvents('next')
    }
    try {
      const data = {};
      if (kyc.kyc_status !== 'compliant' && kyc.dl_docs_status !== '' && kyc.dl_docs_status !== 'init' && kyc.dl_docs_status !== null) {
        if (kyc.all_dl_doc_statuses.pan_fetch_status === null || kyc.all_dl_doc_statuses.pan_fetch_status === '' || kyc.all_dl_doc_statuses.pan_fetch_status === 'failed') {
          data.kyc_flow =  'dl';
        }
      }
      setIsApiRunning("button")
      const result = await upload(file, 'pan', data);
      if (
        (result.pan_ocr && !result.pan_ocr.ocr_pan_kyc_matches) ||
        (result.error && !result.ocr_pan_kyc_matches)
      ) {
        
        setSubTitle("PAN number doesn't match with the uploaded PAN image")
        setTitle("PAN verification failed")
        setBottomSheetImage("pan_verification_failed.svg");
        setIsUploadError(true);
        setIsOpen(true);
      } else {
        if(!isEmpty(result)) {
          updateKyc(result.kyc)
        }
        if (isTradingEnabled()) {
          setSubTitle("You're almost there, now take a selfie")
        } else {
          setSubTitle("You've successfully uploaded PAN!")
        }
        setTitle("PAN uploaded")
        setBottomSheetImage("ic_indian_resident.svg");
        setIsUploadSuccess(true);
        setIsOpen(true);
      }
    } catch (err) {
      toast(err?.message)
      console.error(err)
    } finally {
      setIsApiRunning(false)
    }
  }

  const sendEvents = (userAction, screenName) => {
    let eventObj = {
      // "event_name": 'KYC_registration',
      "event_name": 'trading_onboarding',
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
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan">
          <div className="sub-title">
            PAN Card: {kyc?.pan?.meta_data?.pan_number}
          </div>
          {/* {file && subTitle && <Alert
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
          <div className="doc-upload-note-row">
            <div className="upload-note"> How to take picture of your PAN document? </div>
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
          <WVBottomSheet
            isOpen={isOpen}
            title={title}
            subtitle={subTitle}
            button1Props={{ 
              title: isUploadSuccess ? "CONTINUE" : "RETRY", 
              type: "primary", 
              onClick: isUploadSuccess ? handleNavigation : handleSubmit
            }}
            image={bottomSheetImage ? require(`assets/${productName}/${bottomSheetImage}`) : ""}
          >
          </WVBottomSheet>
        </section>
      )}
    </Container>
  );
}

export default Pan
