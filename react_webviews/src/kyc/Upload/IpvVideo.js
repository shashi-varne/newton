import React, { useState, useEffect } from 'react'
import VideoRecorder from 'react-video-recorder'
import Container from '../common/Container'
import Button from '../../common/ui/Button'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import { isEmpty } from '../../utils/validators'
import { getIpvCode, upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import toast from '../../common/ui/Toast'
import KnowMore from '../mini-components/IpvVideoKnowMore'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";

const config = getConfig();
const productName = config.productName
const isWeb = config.Web
const IpvVideo = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ipvcode, setIpvCode] = useState('')
  const {kyc, isLoading, updateKyc} = useUserKycHook();
  const [showKnowMoreDialog, setKnowMoreDialog] = useState(false)
  const [showVideoRecoreder, setShowVideoRecorder] = useState(false)
  const [uploadCTAText, setUploadCTAText] = useState("OPEN CAMERA")
  const [isRecordingComplete, steIsRecordingComplete] = useState(false);

  const open = () => {
    setKnowMoreDialog(true)
  }

  const close = () => {
    setKnowMoreDialog(false)
  }

  useEffect(() => {
    fetchIpvCode()
  }, [])

  const fetchIpvCode = async () => {
    try {
      const result = await getIpvCode()
      setIpvCode(result.ipv_code)
    } catch (err) {
      toast(err.message)
    } finally {
      setLoading(false)
    }
  }

  const native_call_handler = (method_name, doc_type, doc_name, doc_side, msg, ipv_code) => {
    window.callbackWeb[method_name]({
      type: 'doc',
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,
      message: msg,
      ipv_code: ipv_code,
      // callbacks from native
      upload: function upload(file) {
        try {
          switch (file.type) {
            case "video/mp4":
            case "video/webm":
            case "video/ogg":
            case "video/x-flv":
            case "video/x-ms-wmv":
            setFile(file)
            setTimeout(
              function () {
                setLoading(false);
              },
              1000
            );
            break;
            default:
              toast('Please select a valid video file')
          }
        } catch (e) {
          //
        }
      },
    })

    window.callbackWeb.add_listener({
      type: 'native_receiver_image',
      show_loader: function (show_loader) {
        setLoading(true)
      },
    })
  }
  
  const handleUpload = (method_name) => {
      native_call_handler(method_name, 'ipvvideo', '', '', 'Look at the screen and read the verification number loud', ipvcode)
  }

  const handleSubmit = async () => {
    const navigate = navigateFunc.bind(props)
    try {
      setIsApiRunning("button")
      const result = await upload(file, 'ipvvideo', { ipv_code: ipvcode })
      updateKyc(result.kyc)
      navigate('/kyc/upload/progress')
    } catch (err) {
      toast(err?.message)
      console.error(err)
    } finally {
      setIsApiRunning(false)
    }
  }

  const handleClick = (e) => {
    if (!isWeb) {
      handleUpload("open_video_camera");
    } else {
      if (!showVideoRecoreder) {
        setShowVideoRecorder(true);
      }
    }
  }

  const onRecordingComplete = (videoBlob) => {
    const fileFromBlob = new File([videoBlob], "ipv-video.webm");
    setFile(fileFromBlob);
    setUploadCTAText("TAKE VIDEO AGAIN");
    steIsRecordingComplete(true);
  }

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={loading || isLoading}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Upload selfie video (IPV)"
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-ipv-video">
          <div className="sub-title">
            As per SEBI, it's compulsory for all investors to go through IPV (In
            Person Verification Process).
          </div>
          <div className="kyc-doc-upload-container noBorder">
            {!isWeb && file && (
              <img
                src={require(`assets/${productName}/video_uploaded_placeholder.svg`)}
                className="preview"
                alt="Uploaded IPV Video"
              />
            )}
            {!file && (
              <div className="instructions-container">
                <div className="ipv_footer_instructions">
                  Start recording,{' '}
                  <strong>by reading the following verification numbers loud</strong>{' '}
                  while looking at the camera
                </div>
                <div className="ipv_code">{ipvcode}</div>
                <img
                  src={require(`assets/${productName}/state_ipv_number.svg`)}
                  alt="Upload Selfie"
                  className="default"
                />
              </div>
            )}
            {isWeb && showVideoRecoreder && 
              <VideoRecorder
                showReplayControls
                replayVideoAutoplayAndLoopOff
                onRecordingComplete={onRecordingComplete}
              />
            }
            <div className="kyc-upload-doc-actions">
              {isWeb && !isRecordingComplete && 
                <div className="button-container">
                  <Button
                    type="outlined"
                    buttonTitle="OPEN CAMERA"
                    onClick={handleClick}
                  />
                </div>
              }
              {!isWeb &&
              <div className="button-container">
                <Button
                  type="outlined"
                  buttonTitle={uploadCTAText}
                  onClick={handleClick}
                />
              </div>}
            </div>
          </div>
          <div className="doc-upload-note-row">
            <div className="upload-note">How to make a selfie video ?</div>
            <WVClickableTextElement
              color="secondary"
              className="know-more-button"
              onClick={() => open()}
            >
              KNOW MORE
            </WVClickableTextElement>
          </div>
        </section>
      )}
      <KnowMore isOpen={showKnowMoreDialog} close={close} />
    </Container>
  )
}

export default IpvVideo
