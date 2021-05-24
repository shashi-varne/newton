import React, { useState, useRef } from 'react'
import Container from '../common/Container'
import Button from '../../common/ui/Button'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { upload } from '../common/api'
import { getFlow, navigate as navigateFunc } from '../common/functions'
import { getConfig, getBase64 } from 'utils/functions'
import toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble'
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'

const isWeb = getConfig().Web

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
  
  const handleChange = (type) => (event) => {
    event.preventDefault();
    sendEvents('get_image', type)
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

  const isWeb = getConfig().Web

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
          <div className="kyc-doc-upload-container noBorder">
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
              <div className="button-container" style={{marginTop: "60px"}}>
                <Button
                  type="outlined"
                  buttonTitle="ATTACH DOCUMENT"
                  onClick={handleClick}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </Container>
  )
}

export default Sign
