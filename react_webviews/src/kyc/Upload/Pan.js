import "./commonStyles.scss";
import React, { useState } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import Alert from '../mini-components/Alert'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { upload } from '../common/api'
import { getConfig } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import KycUploadContainer from '../mini-components/KycUploadContainer'

const config = getConfig();
const productName = config.productName;

const Pan = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [title, setTitle] = useState("Note")
  const [subTitle, setSubTitle] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const {kyc, isLoading} = useUserKycHook();

  const onFileSelectComplete = (newFile, fileBase64) => {
    setFile(newFile);
    setFileToShow(fileBase64);
  }

  const onFileSelectError = (error) => {
    toast('Please select image file only');
  }

  const handleSubmit = async () => {
    try {
      const data = {};
      if (kyc.kyc_status !== 'compliant' && kyc.dl_docs_status !== '' && kyc.dl_docs_status !== 'init' && kyc.dl_docs_status !== null) {
        if (kyc.all_dl_doc_statuses.pan_fetch_status === null || kyc.all_dl_doc_statuses.pan_fetch_status === '' || kyc.all_dl_doc_statuses.pan_fetch_status === 'failed') {
          data.kyc_flow =  'dl';
        }
      }
      setIsApiRunning("button")
      const response = await upload(file, 'pan', data);
      const result = response.result;
      if (
        (result.pan_ocr && !result.pan_ocr.ocr_pan_kyc_matches) ||
        (result.error && !result.ocr_pan_kyc_matches)
      ) {
        setSubTitle(
          'Photo of PAN should be clear and it should not have the exposure of flash light'
        )
        setTitle('PAN mismatch!')
      } else {
        storageService().setObject(storageConstants.KYC, result.kyc)
        if (
          result.kyc.kyc_status !== 'compliant' &&
          result.kyc.dl_docs_status !== '' &&
          result.kyc.dl_docs_status !== 'init' &&
          result.kyc.dl_docs_status !== null
        ) {
          navigate('/kyc-esign/info')
        } else {
          navigate('/kyc/upload/progress')
        }
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
      skelton={isLoading || showLoader}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Upload PAN"
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan">
          <div className="sub-title">
            PAN Card {kyc?.pan?.meta_data?.pan_number}
          </div>
          {file && subTitle && <Alert
            variant="attention"
            title={title}
            message={subTitle}
          />}
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
              pickerType="gallery"
              fileName="pan"
              onFileSelectComplete={onFileSelectComplete}
              onFileSelectError={onFileSelectError}
              supportedFormats={['jpeg', 'jpg', 'png', 'bmp']}
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
        </section>
      )}
    </Container>
  )
}

export default Pan
