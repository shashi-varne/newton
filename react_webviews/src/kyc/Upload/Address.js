import "./commonStyles.scss";
import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import { storageService, } from '../../utils/validators'
import { storageConstants, docMapper, SUPPORTED_IMAGE_TYPES } from '../constants'
import { upload } from '../common/api'
import { getConfig } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { combinedDocBlob } from '../common/functions'
import { navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'
import KycUploadContainer from '../mini-components/KycUploadContainer'
import { isEmpty } from 'lodash';
import Alert from "../mini-components/Alert";

const getTitleList = ({ kyc, myAccountFlow }) => {
  let titleList = [
    'Photo of address card should have your signature',
    'Photo of address should be clear and it should not have the exposure of flash light',
  ]
  if (
    kyc?.kyc_status !== 'compliant' &&
    kyc?.dl_docs_status !== '' &&
    kyc?.dl_docs_status !== 'init' &&
    kyc?.dl_docs_status !== null && 
    !myAccountFlow
  ) {
    if (
      kyc.all_dl_doc_statuses.pan_fetch_status === null ||
      kyc.all_dl_doc_statuses.pan_fetch_status === '' ||
      kyc.all_dl_doc_statuses.pan_fetch_status === 'failed'
    ) {
      titleList[0] =
        'Oops! seems like Digilocker is down, please upload your address to proceed further'
    }
  }
  return titleList
}

const MessageComponent = (kyc, myAccountFlow) => {
  const [titleList] = useState(getTitleList(kyc, myAccountFlow))
  return (
    <section className="pan-alert">
      {titleList.map((title, idx) => (
        <div className="row" key={idx}>
          <div className="order">{idx + 1}.</div>
          <div className="value">{title}</div>
        </div>
      ))}
    </section>
  )
}

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
  const [showLoader, setShowLoader] = useState(false)
  const [backDoc, setBackDoc] = useState(null)
  const [file, setFile] = useState(null)
  const [state, setState] = useState({})
  const {kyc: kycData, isLoading} = useUserKycHook();
  const [kyc, setKyc] = useState(kycData);

  useEffect(() => {
    setKyc(kycData);
  }, [kycData])

  const onFileSelectComplete = (type) => (file, fileBase64) => {
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

  const onFileSelectError = () => {
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
      let result, response
      if (onlyFrontDocRequired) {
        response = await upload(frontDoc, 'address', {
          addressProofKey: addressProofKey,
        })
      } else {
        response = await upload(file, 'address', {
          addressProofKey: addressProofKey,
        })
      }
      if(response.status_code === 200) {
        result = response.result;
        setKyc(result.kyc)
        storageService().setObject(storageConstants.KYC, result.kyc)
        if(isMyAccountFlow) {
          navigate('/my-account');
        } else {
          navigate('/kyc/upload/progress');
        }
      } else {
        throw new Error(response?.result?.error || response?.result?.message || "Something went wrong!")
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
    ? docMapper[stateParams.addressDocType]
    : docMapper[kyc?.address_doc_type];
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

  const sendEvents = (userAction, type, docSide) => {
    // callbackWeb.eventCallback to be added
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "address_doc",
        "type": type || "",
        "doc_side": docSide || "",
        "doc_type": addressProofKey
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  const title =
    isMyAccountFlow && kyc?.address?.meta_data?.is_nri
      ? "Upload Indian Address Proof"
      : "Upload address proof";
  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      events={sendEvents("just_set_events")}
      skelton={isLoading || showLoader}
      handleClick={handleSubmit}
      disable={!frontDoc && !backDoc}
      showLoader={isApiRunning}
      title={title}
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-address">
          {!isMyAccountFlow && (
            <div className="sub-title">
              {getFullAddress()}
              {getFullAddress() && (
                <div className="edit" onClick={editAddress}>
                  EDIT
                </div>
              )}
            </div>
          )}
          <Alert
            variant="attention"
            title="Note"
            renderMessage={() => <MessageComponent kyc={kyc} />}
          /> 
          <KycUploadContainer.TitleText alignLeft>
            <span><b>Front side</b></span> of your {addressProof}
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
              showOptionsDialog
              nativePickerMethodName="open_gallery"
              fileName="address_proof_front"
              customPickerId="wv-input-front"
              onFileSelectComplete={onFileSelectComplete('front')}
              onFileSelectError={onFileSelectError}
              supportedFormats={SUPPORTED_IMAGE_TYPES}
            />
          </KycUploadContainer>

          {!onlyFrontDocRequired &&
            <>
              <KycUploadContainer.TitleText alignLeft>
                <span><b>Back side</b></span> of your {addressProof}
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
                  showOptionsDialog
                  nativePickerMethodName="open_gallery"
                  fileName="address_proof_rear"
                  customPickerId="wv-input-back"
                  onFileSelectComplete={onFileSelectComplete('back')}
                  onFileSelectError={onFileSelectError}
                  supportedFormats={SUPPORTED_IMAGE_TYPES}
                />
              </KycUploadContainer>
            </>
          }
          <div className="doc-upload-note-row">
            <div className="upload-note"> How to take picture of your address proof? </div>
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

export default AddressUpload
