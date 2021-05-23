import React, { useState, useRef } from 'react'
import Container from '../common/Container'
import Button from '../../common/ui/Button'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import Alert from '../mini-components/Alert'
import FileAccessDialog from '../mini-components/FileAccessDialog'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { upload } from '../common/api'
import { getBase64, getConfig } from '../../utils/functions'
import toast from '../../common/ui/Toast'
import { navigate as navigateFunc } from '../common/functions'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";

const config = getConfig();
const isWeb = config.Web
const productName = config.productName;

const Pan = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [title, setTitle] = useState("Note")
  const [subTitle, setSubTitle] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false)
  const {kyc, isLoading} = useUserKycHook();

  const inputEl = useRef(null)

  const native_call_handler = (method_name, doc_type, doc_name, doc_side) => {
    window.callbackWeb[method_name]({
      type: 'doc',
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,
      // callbacks from native
      upload: function upload(file) {
        try {
          switch (file.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/bmp':
              setFile(file)
              getBase64(file, function (img) {
                setFileToShow(img)
              })
              setTimeout(
                function () {
                  setShowLoader(false);
                },
                1000
              );
              break;
            default:
              toast('Please select image file')
          }
        } catch (e) {
          //
        }
      },
    })

    window.callbackWeb.add_listener({
      type: 'native_receiver_image',
      show_loader: function (show_loader) {
        setShowLoader(true)
      },
    })
  }
  
  const handleChange = (event) => {
    event.preventDefault();
    const uploadedFile = event.target.files[0]
    let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']

    if (acceptedType.indexOf(uploadedFile.type) === -1) {
      toast('Please select image file only')
      return
    }

    setFile(uploadedFile)
    getBase64(uploadedFile, function (img) {
      setFileToShow(img)
    })
  }

  const handleUpload = (method_name) => {
    if(getConfig().html_camera)
      inputEl.current.click()
    else {
      setIsAccessDialogOpen(false);
      native_call_handler(method_name, 'pan', 'pan.jpg', 'front')
    }
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

  const handleClick = () => {
    if (!isWeb) {
      setIsAccessDialogOpen(true);
    } else {
      handleUpload("open_gallery");
    }
  }

  const handleAccessDialogClose = (event, reason) => {
    setIsAccessDialogOpen(false);
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
      data-aid='kyc-upload-pan-screen'
    >
      {!isEmpty(kyc) && (
        <section data-aid='kyc-upload-pan'>
          <div className="sub-title" data-aid='kyc-sub-title'>
            PAN Card {kyc?.pan?.meta_data?.pan_number}
          </div>
          {file && subTitle && <Alert
            dataAid='kyc-upload-pan-alertbox'
            variant="attention"
            title={title}
            message={subTitle}
          />}
          <div className="kyc-doc-upload-container noBorder" data-aid='kyc-doc-upload-container'>
            <div className="caption" data-aid='caption-text'>Your PAN card should be clearly visible in your pic</div>
            {!file && 
              <img
              src={require(`assets/${productName}/pan_card.svg`)}
              className="default"
              alt="Default PAN Card"
            />
            }
            {file && fileToShow && (
              <img
                src={fileToShow}
                className="preview"
                alt="Uploaded PAN Card"
              />
            )}
            <div className="kyc-upload-doc-actions" data-aid='kyc-upload-doc-actions'>
              <input
                ref={inputEl}
                type="file"
                className="kyc-upload"
                onChange={handleChange}
              />
              <div className="button-container">
                <Button
                  dataAid='attach-doc-btn'
                  type="outlined"
                  buttonTitle="ATTACH DOCUMENT"
                  onClick={handleClick}
                />
              </div>
            </div>
          </div>
          <div className="doc-upload-note-row" data-aid='doc-upload-note-row'>
            <div className="upload-note" data-aid='upload-note-text'> How to take picture of your PAN document? </div>
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
          <FileAccessDialog 
            isOpen={isAccessDialogOpen}
            handleUpload={handleUpload}
            onClose={handleAccessDialogClose}
          />
        </section>
      )}
    </Container>
  )
}

export default Pan
