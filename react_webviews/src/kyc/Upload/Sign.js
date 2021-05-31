import React, { useState } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { getPathname, storageConstants, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { isDigilockerFlow, navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble'
import "./commonStyles.scss";
import KycUploadContainer from '../mini-components/KycUploadContainer'

const isWeb = getConfig().Web

const Sign = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  // const [showLoader, setShowLoader] = useState(false)

  const {kyc, isLoading, updateKyc} = useUserKycHook();

  const onFileSelectComplete = (file, fileBase64) => {
    setFile(file);
    setFileToShow(fileBase64)
  }

  const onFileSelectError = () => {
    toast('Please select image file only')
  }

  const handleSubmit = async () => {
    try {
      setIsApiRunning("button")
      const result = await upload(file, 'sign')
      updateKyc(result.kyc);
      const dlFlow = isDigilockerFlow(kyc);
      const type = result?.kyc?.kyc_status === "compliant" ? "compliant" : "non-compliant";

      if (dlFlow || type === "compliant") {
        navigate(`/kyc/${type}/bank-details`);
      } else {
        if (props?.location?.state?.backToJourney) {
          navigate(getPathname.journey);
        } else {
          navigate(getPathname.uploadProgress);
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
      skelton={isLoading}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Share Signature"
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-sign">
          <WVInfoBubble
            isDismissable
            isOpen={true}
            type="info"
          >
            Signature should be as per your PAN. Invalid signature can lead to investment rejection
          </WVInfoBubble>
          <KycUploadContainer>
            <div className="kuc-sign-image-container" style={{ height: fileToShow ? 'auto' : '250px' }}>
              <KycUploadContainer.Image
                fileToShow={file && fileToShow}
                illustration={require(`assets/signature_icon.svg`)}
                alt={`${fileToShow ? 'Uploaded' : 'Upload'} Signature`}
                className={fileToShow ? '' : 'kuc-sign-image'}
              />
            </div>
            <KycUploadContainer.Button
              withPicker
              nativePickerMethodName={!isWeb ? 'open_canvas' : 'open_gallery'}
              fileName="signature"
              onFileSelectComplete={onFileSelectComplete}
              onFileSelectError={onFileSelectError}
              supportedFormats={SUPPORTED_IMAGE_TYPES}
            >
              {!file ? "SIGN" : "SIGN AGAIN"}
            </KycUploadContainer.Button>
          </KycUploadContainer>
        </section>
      )}
    </Container>
  )
}

export default Sign
