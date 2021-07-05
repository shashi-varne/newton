import "./commonStyles.scss";
import React, { useState } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import { DOCUMENTS_MAPPER, SUPPORTED_IMAGE_TYPES, PATHNAME_MAPPER } from '../constants'
import { upload } from '../common/api'
import { getConfig, navigate as navigateFunc } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { combinedDocBlob } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import KycUploadContainer from '../mini-components/KycUploadContainer'
import { isEmpty } from 'lodash';
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'

const config = getConfig();
const productName = config.productName

const AddressUpload = (props) => {
  const navigate = navigateFunc.bind(props)
  const stateParams = props?.location?.state || {}
  const isMyAccountFlow = stateParams.flow === "myAccount";
  if(isMyAccountFlow &&  !stateParams.addressDocType) {
    navigate("/kyc/change-address-details1");
  }
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
        result = await upload(frontDoc, 'address', {
          address_proof_key: addressProofKey,
        })
      } else {
        result = await upload(file, 'address', {
          address_proof_key: addressProofKey,
        })
      }
      updateKyc(result.kyc)
      if(isMyAccountFlow) {
        navigate("/my-account");
      } else {
        navigate(PATHNAME_MAPPER.uploadProgress)
      }
    } catch (err) {
      console.error(err)
      toast(err?.message)
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

  var addressProofKey = kyc?.address?.meta_data?.is_nri
    ? "passport"
    : isMyAccountFlow
    ? stateParams.addressDocType
    : kyc?.address_doc_type;
  var addressProof = kyc?.address?.meta_data?.is_nri
    ? "Passport"
    : isMyAccountFlow
    ? DOCUMENTS_MAPPER[stateParams.addressDocType]
    : DOCUMENTS_MAPPER[kyc?.address_doc_type];
  const onlyFrontDocRequired = ['UTILITY_BILL', 'LAT_BANK_PB'].includes(
    addressProofKey
  )

  const getFullAddress = () => {
    let addressFull = ''

    if (kyc?.address?.meta_data?.addressline) {
      addressFull += setComma(kyc?.address?.meta_data?.addressline)
    }

    if (kyc?.address?.meta_data?.city) {
      addressFull += setComma(kyc?.address?.meta_data?.city)
    }

    if (kyc?.address?.meta_data?.state) {
      addressFull += setComma(kyc?.address?.meta_data?.state)
    }

    if (kyc?.address?.meta_data?.country) {
      addressFull += setComma(kyc?.address?.meta_data?.country)
    }

    if (kyc?.address?.meta_data?.pincode) {
      addressFull += kyc?.address?.meta_data?.pincode
    }

    return addressFull
  }

  const editAddress = () => {
    sendEvents('edit')
    navigate("/kyc/address-details1", {
      state: {
        backToJourney: true,
      },
    });
  };

  const onKnowMoreClick = () => {
    sendEvents('know_more');
    navigate("/kyc/upload-instructions", {
      state: { document: "address" }
    });
  };

  const sendEvents = (userAction, type, docSide) => {
    // callbackWeb.eventCallback to be added
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "upload_address_proof",
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
  
  const title =
    isMyAccountFlow && kyc?.address?.meta_data?.is_nri
      ? "Upload Indian Address Proof"
      : "Upload address proof";
  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      events={sendEvents("just_set_events")}
      handleClick={handleSubmit}
      disable={!frontDoc || (!onlyFrontDocRequired && !backDoc)}
      showLoader={isApiRunning}
      title={title}
      data-aid='kyc-upload-adress-proof-screen'
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-address" data-aid='kyc-upload-address'>
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
              fileToShow={frontDoc && state.frontFileShow}
              illustration={require(`assets/${productName}/address_proof_front.svg`)}
              onLoad={handleImageLoad}
              alt="Address Proof Front"
            />
            <KycUploadContainer.Button
              withPicker
              filePickerProps={{
                showOptionsDialog: true,
                shouldCompress: true,
                nativePickerMethodName: "open_gallery",
                fileName: "address_proof_front",
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
                  fileToShow={backDoc && state.backFileShow}
                  illustration={require(`assets/${productName}/address_proof_rear.svg`)}
                  onLoad={handleImageLoad}
                  alt="Address Proof Rear"
                />
                <KycUploadContainer.Button
                  withPicker
                  filePickerProps={{
                    showOptionsDialog: true,
                    shouldCompress: true,
                    nativePickerMethodName: "open_gallery",
                    fileName: "address_proof_rear",
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
              onClick={onKnowMoreClick}
            >
              KNOW MORE
            </WVClickableTextElement>
          </div>
        </section>
      )}
    </Container>
  )
}

export default AddressUpload
