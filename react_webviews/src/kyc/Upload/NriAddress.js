import "./commonStyles.scss";
import React, { useState } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import { NRI_DOCUMENTS_MAPPER, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig, navigate as navigateFunc } from '../../utils/functions'
import toast from 'common/ui/Toast'
import { combinedDocBlob } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import { isEmpty } from 'lodash';
import KycUploadContainer from '../mini-components/KycUploadContainer'
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'

const config = getConfig();
const productName = config.productName

const NRIAddressUpload = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [frontDoc, setFrontDoc] = useState(null)
  const [backDoc, setBackDoc] = useState(null)
  const [file, setFile] = useState(null)
  const [state, setState] = useState({})
  const {kyc, isLoading, updateKyc} = useUserKycHook();

  const onFileSelectComplete = (type) => (file, fileBase64) => {
    sendEvents('get_image', 'gallery', type);
    if (type === 'front') {
      setFrontDoc(file);
      setState({
        ...state,
        frontFileShow: fileBase64,
      });
    } else {
      setBackDoc(file);
      setState({
        ...state,
        backFileShow: fileBase64,
      });
    }
  }

  const onFileSelectError = (type) => () => {
    sendEvents('get_image', 'gallery', type);
    return toast('Please select image file only');
  }

  const handleImageLoad = () => {
    const fr = new Image()
    const bc = new Image()
    if (state.frontFileShow && state.backFileShow) {
      fr.src = state.frontFileShow
      bc.src = state.backFileShow
      const blob = combinedDocBlob(fr, bc, 'address')
      console.log(blob)
      setFile(blob)
    }
  }

  const handleSubmit = async () => {
    sendEvents('next')
    try {
      setIsApiRunning("button")
      let result;
      if (onlyFrontDocRequired) {
        result = await upload(frontDoc, 'nri_address', {
          address_proof_key: addressProofKey,
        })
      } else {
        result = await upload(file, 'nri_address', {
          addressProofKey,
        })
      }
      updateKyc(result.kyc)
      navigate('/kyc/upload/progress')
    } catch (err) {
      toast(err?.message)
      console.error(err)
    } finally {
      console.log('uploaded')
      setIsApiRunning(false)
    }
  }

  const setComma = (addressLine) => {
    if (addressLine !== '') {
      return (addressLine += ', ')
    }
    return addressLine
  }

  const addressProofKey = kyc?.nri_address_doc_type
  const addressProof = NRI_DOCUMENTS_MAPPER[addressProofKey]
  const onlyFrontDocRequired = ['UTILITY_BILL', 'LAT_BANK_PB'].includes(
    addressProofKey
  )

  const getFullAddress = () => {
    let addressFull = ''

    if (kyc?.nri_address?.meta_data?.addressline) {
      addressFull += setComma(kyc?.nri_address?.meta_data?.addressline)
    }

    if (kyc?.nri_address?.meta_data?.city) {
      addressFull += setComma(kyc?.nri_address?.meta_data?.city)
    }

    if (kyc?.nri_address?.meta_data?.state) {
      addressFull += setComma(kyc?.nri_address?.meta_data?.state)
    }

    if (kyc?.nri_address?.meta_data?.country) {
      addressFull += setComma(kyc?.nri_address?.meta_data?.country)
    }

    if (kyc?.nri_address?.meta_data?.pincode) {
      addressFull += kyc?.nri_address?.meta_data?.pincode
    }

    return addressFull
  }

  const editAddress = () => {
    sendEvents('edit')
    navigate("/kyc/nri-address-details1", {
      state: {
        backToJourney: true,
      },
    });
  };

  const sendEvents = (userAction, type, docSide) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "nri_address_doc",
        type: type || "",
        doc_side: docSide || "",
        doc_type: addressProofKey,
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
      skelton={isLoading}
      handleClick={handleSubmit}
      disable={!frontDoc || (!onlyFrontDocRequired && !backDoc)}
      showLoader={isApiRunning}
      title="Upload foreign address proof"
      data-aid='kyc-upload-foreign-address-proof-screen'
      events={sendEvents("just_set_events")}
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-address" data-aid='kyc-upload-foreign-address-proof-page'>
          <div className="sub-title" data-aid='kyc-sub-title'>
            <span data-aid='kyc-address-proof'>{addressProof}</span>
            {addressProof && (
              <div className="edit" data-aid='kyc-edit' onClick={editAddress}>
                EDIT
              </div>
            )}
          </div>
          <div className="address-detail" data-aid='kyc-address-detail'>{getFullAddress()}</div>
          <KycUploadContainer.TitleText alignLeft>
            <span data-aid='kyc-address-proof-front-side'><b>Front side</b></span> of your {addressProof}
          </KycUploadContainer.TitleText>
          <KycUploadContainer>
            <KycUploadContainer.Image
              illustration={require(`assets/${productName}/address_proof_front.svg`)}
              fileToShow={frontDoc && state.frontFileShow}
              alt="Address Proof Front"
              onLoad={handleImageLoad}
            />
            <KycUploadContainer.Button
              withPicker
              filePickerProps={{
                showOptionsDialog: true,
                shouldCompress: true,
                nativePickerMethodName: "open_gallery",
                fileName: "nri_address_front",
                customPickerId: "wv-input-front",
                onFileSelectComplete: onFileSelectComplete('front'),
                onFileSelectError: onFileSelectError,
                supportedFormats: SUPPORTED_IMAGE_TYPES
              }}
            />
          </KycUploadContainer>
          {!onlyFrontDocRequired &&
            <>
              <KycUploadContainer.TitleText alignLeft>
                <span data-aid='kyc-address-proof-back-side'><b>Back side</b></span> of your {addressProof}
              </KycUploadContainer.TitleText>
              <KycUploadContainer>
                <KycUploadContainer.Image
                  illustration={require(`assets/${productName}/address_proof_rear.svg`)}
                  fileToShow={backDoc && state.backFileShow}
                  alt="Address Proof Rear"
                  onLoad={handleImageLoad}
                />
                <KycUploadContainer.Button
                  withPicker
                  filePickerProps={{
                    showOptionsDialog: true,
                    nativePickerMethodName: "open_gallery",
                    shouldCompress: true,
                    fileName: "nri_address_back",
                    customPickerId: "wv-input-back",
                    onFileSelectComplete: onFileSelectComplete('back'),
                    onFileSelectError: onFileSelectError,
                    supportedFormats: SUPPORTED_IMAGE_TYPES
                  }}
                />
              </KycUploadContainer>
            </>
          }
          <div className="doc-upload-note-row" data-aid='doc-upload-note-row'>
            <div className="upload-note" data-aid='upload-note-text'> How to take picture of your address proof? </div>
            <WVClickableTextElement
              color="secondary"
              className="know-more-button"
              onClick={() => navigate("/kyc/upload-instructions", {
                state: { document: "address" }
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

export default NRIAddressUpload
