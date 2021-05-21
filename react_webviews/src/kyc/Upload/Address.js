import React, { useState, useEffect, useRef } from 'react'
import Container from '../common/Container'
import Button from '../../common/ui/Button'
import Alert from '../mini-components/Alert'
import FileAccessDialog from '../mini-components/FileAccessDialog'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants, docMapper } from '../constants'
import { upload } from '../common/api'
import { getBase64, getConfig } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { combinedDocBlob } from '../common/functions'
import { navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";

const getTitleList = ({ kyc }) => {
  let titleList = [
    'Photo of address card should have your signature',
    'Photo of address should be clear and it should not have the exposure of flash light',
  ]
  if (
    kyc?.kyc_status !== 'compliant' &&
    kyc?.dl_docs_status !== '' &&
    kyc?.dl_docs_status !== 'init' &&
    kyc?.dl_docs_status !== null
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

const MessageComponent = (kyc) => {
  const [titleList] = useState(getTitleList(kyc))
  return (
    <section className="pan-alert" data-aid='kyc-pan-alert'>
      {titleList.map((title, idx) => (
        <div className="row" key={idx} data-aid={`row-${idx + 1}`}>
          <div className="order" data-aid={`order-${idx + 1}`}>{idx + 1}.</div>
          <div className="value" data-aid={`value-${idx + 1}`}>{title}</div>
        </div>
      ))}
    </section>
  )
}

const config = getConfig();
const isWeb = config.Web
const productName = config.productName

const AddressUpload = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [frontDoc, setFrontDoc] = useState(null)
  const [showLoader, setShowLoader] = useState(false)
  const [backDoc, setBackDoc] = useState(null)
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [docSide, setDocSide] = useState("");
  const [state, setState] = useState({})
  const {kyc: kycData, isLoading} = useUserKycHook();
  const [kyc, setKyc] = useState(
    kycData
  )

  useEffect(() => {
    setKyc(kycData)
  }, [kycData])

  const frontDocRef = useRef(null)
  const backDocRef = useRef(null)

  const native_call_handler = (method_name, doc_type, doc_name, doc_side) => {
    window.callbackWeb[method_name]({
      type: 'doc',
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,
      // callbacks from native
      upload: function upload(file) {
        try {
          setState({
            ...state,
            docType: doc_type,
            docName: doc_name,
            doc_side: doc_side,
            show_loader: true,
          })
          if (doc_side === 'back') {
            setFrontDoc(file)
          } else {
            setBackDoc(file)
          }
          switch (file.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/bmp':
              mergeDocs(file, doc_side);
              setTimeout(
                function () {
                  setShowLoader(false);
                },
                1000
              );
              break
            default:
              toast('Please select image file')
              setState({
                ...state,
                docType: doc_type,
                show_loader: false,
              })
          }
        } catch (e) {
          //
        }
      },
    })

    window.callbackWeb.add_listener({
      type: 'native_receiver_image',
      show_loader: function (show_loader) {
        setState({
          ...state,
          show_loader: true,
        })
      },
    })
  }

  const handleChange = (type) => (event) => {
    const uploadedFile = event.target.files[0]
    let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']

    if (acceptedType.indexOf(uploadedFile.type) === -1) {
      toast('Please select image file only')
      return
    }
    if (type === 'front') {
      setFrontDoc(uploadedFile)
    } else {
      setBackDoc(uploadedFile)
    }
    mergeDocs(uploadedFile, type);
  }

  const mergeDocs = (file, type) => {
    if (type === 'front') {
      setFrontDoc(file)
    } else {
      setBackDoc(file)
    }

    getBase64(file, function (img) {
      if (type === 'front') {
        setState({
          ...state,
          frontFileShow: img,
        })
      } else {
        setState({
          ...state,
          backFileShow: img,
        })
      }
    })
  }

  const handleUpload = (method_name, type) => {
    if(getConfig().html_camera){
      if (type === 'front') {
        frontDocRef.current.click()
      } else {
        backDocRef.current.click()
      }
    }   
    else {
      setIsAccessDialogOpen(false);
      native_call_handler(method_name, `address_${type}`, `address_${type}.jpg`, type)
    }
  }

  const handleImageLoad = (event) => {
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
    try {
      setIsApiRunning("button")
      let result, response
      if (onlyFrontDocRequired) {
        response = await upload(frontDoc, 'address', {
          address_proof_key: addressProofKey,
        })
      } else {
        response = await upload(file, 'address', {
          address_proof_key: addressProofKey,
        })
      }
      if(response.status_code === 200) {
        result = response.result;
        setKyc(result.kyc)
        storageService().setObject(storageConstants.KYC, result.kyc)
        navigate('/kyc/upload/progress')
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

  const handleClick = (method_name, type) => {
    setDocSide(type);
    if (!isWeb) {
      setIsAccessDialogOpen(true);
    } else {
      handleUpload("open_gallery", type);
    }
  }

  const setComma = (addressLine) => {
    if (addressLine !== '') {
      return (addressLine += ', ')
    }
    return addressLine
  }

  var addressProofKey = kyc?.address?.meta_data?.is_nri
    ? 'passport'
    : kyc?.address_doc_type
  var addressProof = kyc?.address?.meta_data?.is_nri
    ? 'Passport'
    : docMapper[kyc?.address_doc_type]
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
    navigate("/kyc/address-details1", {
      state: {
        backToJourney: true,
      },
    });
  };

  const handleAccessDialogClose = (event, reason) => {
    setIsAccessDialogOpen(false);
  }

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading || showLoader}
      handleClick={handleSubmit}
      disable={!frontDoc && !backDoc}
      showLoader={isApiRunning}
      title="Upload address proof"
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
          {/* <Alert
            variant="attention"
            title="Note"
            renderMessage={() => <MessageComponent kyc={kyc} />}
          /> */}
          <div className="kyc-doc-upload-container noBorder" data-aid='kyc-doc-upload-container'>
            <div className="align-left">
              <span data-aid='kyc-address-proof-front-side'><b>Front side</b></span> of your {addressProof}
            </div>
            {!frontDoc && (
              <img
                src={require(`assets/${productName}/address_proof_front.svg`)}
                className="default"
                onLoad={handleImageLoad}
                alt="Default Address Proof Front"
              />
            )}
            {frontDoc && state.frontFileShow && (
              <img
                src={state.frontFileShow}
                className="preview"
                alt="Uploaded PAN Card"
                onLoad={handleImageLoad}
              />
            )}
            <div className="kyc-upload-doc-actions" data-aid='kyc-upload-doc-actions'>
              <input
                ref={frontDocRef}
                type="file"
                className="kyc-upload"
                onChange={handleChange('front')}
              />
              <div className="button-container">
                <Button
                  dataAid='attach-doc-btn'
                  type="outlined"
                  buttonTitle="ATTACH DOCUMENT"
                  onClick={() => handleClick("open_gallery", "front")}
                />
              </div>
            </div>
          </div>
          {!onlyFrontDocRequired && (
            <div className="kyc-doc-upload-container noBorder" data-aid='kyc-doc-upload-container'>
              <div className="align-left">
                <span data-aid='kyc-address-proof-back-side'><b>Back side</b></span> of your {addressProof}
              </div>
              {!backDoc && (
                <img
                  src={require(`assets/${productName}/address_proof_rear.svg`)}
                  className="default"
                  onLoad={handleImageLoad}
                  alt="Default Address Proof Rear"
                />
              )}
              {backDoc && state.backFileShow && (
                <img
                  src={state.backFileShow}
                  className="preview"
                  alt="Uploaded Address Document"
                  onLoad={handleImageLoad}
                />
              )}
              <div className="kyc-upload-doc-actions noBorder" data-aid='kyc-upload-doc-actions'>
                <input
                  ref={backDocRef}
                  type="file"
                  className="kyc-upload"
                  onChange={handleChange('back')}
                />
                <div className="button-container">
                  <Button
                    dataAid='attach-doc-btn'
                    type="outlined"
                    buttonTitle="ATTACH DOCUMENT"
                    onClick={() => handleClick("open_gallery", "back")}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="doc-upload-note-row" data-aid='doc-upload-note-row'>
            <div className="upload-note" data-aid='upload-note-text'> How to take picture of your address proof? </div>
            <Button
              dataAid='know-more-btn'
              type="textonly"
              buttonTitle="KNOW MORE"
              classes={{ root: "know-more-button" }}
              onClick={() => navigate("/kyc/upload-instructions", {
                state: { document: "address" }
              })}
            />
          </div>
          <FileAccessDialog 
            isOpen={isAccessDialogOpen}
            handleUpload={handleUpload}
            docSide={docSide}
            onClose={handleAccessDialogClose}
          />
        </section>
      )}
    </Container>
  )
}

export default AddressUpload
