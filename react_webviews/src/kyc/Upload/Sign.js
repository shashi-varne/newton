import React, { useState } from 'react'
import Container from '../common/Container'
import { isEmpty } from '../../utils/validators'
import { SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig, navigate as navigateFunc } from 'utils/functions'
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
  const [showLoader, setShowLoader] = useState(false)

const {kyc, isLoading, updateKyc} = useUserKycHook();

  const onFileSelectComplete = (file, fileBase64) => {
    setFile(file);
    setFileToShow(fileBase64)
  }

  const onFileSelectError = () => {
    return toast('Please select image file only')
  }

  const handleSubmit = async () => {
    try {
      setIsApiRunning("button")
      const response = await upload(file, 'sign')
      if (response.status_code === 200) {
        const result = response.result;
        updateKyc(result.kyc);
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

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading || showLoader}
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
