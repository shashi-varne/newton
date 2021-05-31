import "./commonStyles.scss";
import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import Alert from '../mini-components/Alert'
import { isEmpty } from '../../utils/validators'
import { getPathname, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig, isTradingEnabled } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { isDigilockerFlow, navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import KycUploadContainer from '../mini-components/KycUploadContainer'
import PanUploadStatus from "../Equity/mini-components/PanUploadStatus";

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
    if (dlFlow) {
      navigate('/kyc-esign/info')
    } else {
      navigate('/kyc/upload/progress')
    }
  };

  const handleNavigation = () => {
    if (isTradingEnabled()) {
      handleOtherPlatformNavigation();
    } else {
      handleSdkNavigation();
    }
  }

  const handleSubmit = async () => {
    if (isOpen) setIsOpen(false)
    try {
      const data = {};
      if (dlFlow) {
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

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
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
          <PanUploadStatus
            status={bottomSheetType}
            isOpen={isOpen}
            onCtaClick={bottomSheetType === "success" ? handleNavigation : handleSubmit}
          />
        </section>
      )}
    </Container>
  )
}

export default Pan
