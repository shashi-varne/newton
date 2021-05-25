import React, { useState } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble'
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'
import KycUploadContainer from '../mini-components/KycUploadContainer'

const isWeb = getConfig().Web

const Sign = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [showLoader, setShowLoader] = useState(false)

  const {kyc, isLoading} = useUserKycHook();

  const onFileSelectComplete = (file, fileBase64) => {
    sendEvents("sign");
    setFile(file);
    setFileToShow(fileBase64)
  }

  const onFileSelectError = () => {
    sendEvents("sign");
    toast('Please select image file only')
  }

  const handleSubmit = async () => {
    sendEvents('next')
    try {
      setIsApiRunning("button")
      const response = await upload(file, 'sign')
      if (response.status_code === 200) {
        const result = response.result;
        storageService().setObject(storageConstants.KYC, result.kyc);
        const dlFlow =
          result.kyc.kyc_status !== "compliant" &&
          !result.kyc.address.meta_data.is_nri &&
          result.kyc.dl_docs_status !== "" &&
          result.kyc.dl_docs_status !== "init" &&
          result.kyc.dl_docs_status !== null;
        if (
          props?.location?.state?.fromState === "kyc/dl/personal-details3" ||
          dlFlow
        ) {
          const type =
            result?.kyc?.kyc_status === "compliant"
              ? "compliant"
              : "non-compliant";
          navigate(`/kyc/${type}/bank-details`);
        } else {
          if (props?.location?.state?.backToJourney) {
            navigate("/kyc/journey");
          } else {
            navigate("/kyc/upload/progress");
          }
        }
      } else {
        throw new Error(
          response?.result?.error ||
            response?.result?.message ||
            "Something went wrong"
        );
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
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "share_signature",
        // "type": type || "",
        // "initial_kyc_status": kyc.initial_kyc_status || "",
        // "flow": getFlow(kyc) || ""
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      events={sendEvents("just_set_events")}
      skelton={isLoading || showLoader}
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
            />
          </KycUploadContainer>
        </section>
      )}
    </Container>
  )
}

export default Sign
