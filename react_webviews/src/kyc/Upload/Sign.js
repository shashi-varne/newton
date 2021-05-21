import React, { useState, useRef } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig, getBase64 } from 'utils/functions'
import toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble'

const Sign = (props) => {
  const navigate = navigateFunc.bind(props)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [fileToShow, setFileToShow] = useState(null)
  const [showLoader, setShowLoader] = useState(false)

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
      show_loader: function () {
        setShowLoader(true)
      },
    })
  }

  const {kyc, isLoading} = useUserKycHook();
  
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
    else 
      native_call_handler(method_name, 'sign', 'sign.jpg', 'front')
  }

  const handleSubmit = async () => {
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

  const isWeb = getConfig().isWebOrSdk

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading || showLoader}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Share Signature"
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan">
          {/* <div className="sub-title">
            Signature should match with your PAN’s signature
          </div> */}
          <WVInfoBubble type="info">
            Signature should be as per your PAN. Invalid signature can lead to
            investment rejection
          </WVInfoBubble>
          {!isWeb && (
            <div
              className="kyc-doc-upload-container"
              style={{ border: 'none' }}
            >
              {file && fileToShow && (
                <img src={fileToShow} className="preview" alt="" />
              )}
              {!file && (
                <img
                  className="icon"
                  src={require(`assets/signature_icon.svg`)}
                  alt="Upload Signature"
                />
              )}
              <div className="kyc-upload-doc-actions">
                <div className="mobile-actions">
                  <div className="open-canvas">
                    <input
                      ref={inputEl}
                      type="file"
                      className="kyc-upload"
                      onChange={handleChange}
                    />
                    <button
                      onClick={() => handleUpload("open_canvas")}
                      className="kyc-upload-button"
                    >
                      {!file && !fileToShow && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g fill-rule="evenodd">
                            <path d="M13.8,18.528 L12.3,21.6 L10.8,18.528 L13.8,18.528 Z M12.3,2.4 C13.1284271,2.4 13.8,3.07157288 13.8,3.9 L13.8,17.76 L10.8,17.76 L10.8,3.9 C10.8,3.07157288 11.4715729,2.4 12.3,2.4 Z" transform="rotate(45 12.3 12)"/>
                            <path d="M24,19.2 L24,24 L19.2,24 L19.2,23.4 L23.4,23.4 L23.4,19.2 L24,19.2 Z M0.6,19.2 L0.6,23.4 L4.8,23.4 L4.8,24 L0,24 L0,19.2 L0.6,19.2 Z M24,0 L24,4.8 L23.4,4.8 L23.4,0.6 L19.2,0.6 L19.2,0 L24,0 Z M0.6,0 L4.8,0 L4.8,0.6 L0.6,0.6 L0.6,4.8 L0,4.8 L0,0 L0.6,0 Z"/>
                          </g>
                        </svg>
                      )}
                      <div className="upload-action">Open Canvas</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isWeb && (
            <div
              className="kyc-doc-upload-container noBorder"
              style={{ marginTop: '70px' }}
            >
              {file && (
                <img
                  src={fileToShow}
                  className="preview"
                  alt="Uploaded Signature"
                />
              )}
              {!file && (
                <img
                  className="icon"
                  src={require(`assets/signature_icon.svg`)}
                  alt="Upload Signature"
                />
              )}
              <div className="kyc-upload-doc-actions">
                <input
                  ref={inputEl}
                  type="file"
                  className="kyc-upload"
                  onChange={handleChange}
                />
                <button onClick={() => handleUpload("open_gallery")} className="kyc-upload-button">
                  {!file && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g transform="translate(0 3)">
                        <path d="M21.4883721,0 L2.51162791,0 C1.12449412,0 0,1.11584416 0,2.49230769 L0,15.5076923 C0,16.8841558 1.12449412,18 2.51162791,18 L21.4883721,18 C22.8755059,18 24,16.8841558 24,15.5076923 L24,2.49230769 C24,1.11584416 22.8755059,0 21.4883721,0 Z M21.1219512,17 L2.87804878,17 C1.84083108,17 1,16.1078831 1,15.0074011 L1,13.1372047 L7.12780488,7 L13,13 L18,9 L23,13.8516937 L23,15.0074011 C23,16.1078831 22.1591689,17 21.1219512,17 Z M23,13 C19.7357846,9.6105021 18.0691179,7.94383544 18,8 L13,12 C9.068603,7.93471236 7.068603,5.93471236 7,6 L1,12 L1,2.92714951 C1,1.86281423 1.84083108,1 2.87804878,1 L21.1219512,1 C22.1591689,1 23,1.86281423 23,2.92714951 L23,13 Z" />
                        <path d="M13.5,2 C12.1192881,2 11,3.11928813 11,4.5 C11,5.88071187 12.1192881,7 13.5,7 C14.8807119,7 16,5.88071187 16,4.5 C16,3.11928813 14.8807119,2 13.5,2 Z M13.5,3 C14.3284271,3 15,3.67157288 15,4.5 C15,5.32842712 14.3284271,6 13.5,6 C12.6715729,6 12,5.32842712 12,4.5 C12,3.67157288 12.6715729,3 13.5,3 Z" />
                      </g>
                    </svg>
                  )}
                  <div className="upload-action">Open Gallery</div>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </Container>
  )
}

export default Sign
