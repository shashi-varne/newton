import React, { useState } from 'react'
import Container from '../common/Container'
import { PATHNAME_MAPPER, SUPPORTED_IMAGE_TYPES } from '../constants'
import { isEmpty } from '../../utils/validators'
import { upload } from '../common/api'
import { isDigilockerFlow, getFlow } from '../common/functions'
import { getConfig, navigate as navigateFunc } from 'utils/functions'
import toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble'
import "./commonStyles.scss";
import KycUploadContainer from '../mini-components/KycUploadContainer'
import { nativeCallback } from '../../utils/native_callback'

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
    sendEvents('next')
    try {
      setIsApiRunning("button")
      const payload = { manual_upload: isWeb }
      const result = await upload(file, 'sign', payload)
      updateKyc(result.kyc);
      const dlFlow = isDigilockerFlow(result.kyc);
      const type = result?.kyc?.kyc_status === "compliant" ? "compliant" : "non-compliant";

      if (dlFlow || type === "compliant") {
        navigate(`/kyc/${type}/bank-details`);
      } else {
        if (props?.location?.state?.backToJourney) {
          navigate(PATHNAME_MAPPER.journey);
        } else {
          navigate(PATHNAME_MAPPER.uploadProgress);
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
        "screen_name": "sign_doc",
        "type": type || "",
        "initial_kyc_status": kyc.initial_kyc_status || "",
        "flow": getFlow(kyc) || ""
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
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Share Signature"
      data-aid='kyc-signature-screen'
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-sign" data-aid='kyc-upload-sign'>
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
              filePickerProps={{
                nativePickerMethodName: !isWeb ? 'open_canvas' : 'open_gallery',
                shouldCompress: isWeb,
                fileName: "signature",
                onFileSelectComplete: onFileSelectComplete,
                onFileSelectError: onFileSelectError,
                supportedFormats: SUPPORTED_IMAGE_TYPES
              }}
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
