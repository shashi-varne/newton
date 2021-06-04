import React, { useState, useEffect, useCallback } from 'react'
import VideoRecorder from 'react-video-recorder'
import Container from '../common/Container'
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement'
import { isEmpty } from '../../utils/validators'
import { getIpvCode, upload } from '../common/api'
import { getConfig, navigate as navigateFunc } from 'utils/functions'
import toast from '../../common/ui/Toast'
import KnowMore from '../mini-components/IpvVideoKnowMore'
import useUserKycHook from '../common/hooks/userKycHook'
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import "./commonStyles.scss";
import { nativeCallback } from '../../utils/native_callback'
import KycUploadContainer from '../mini-components/KycUploadContainer'

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
  const [noCameraFound, setNoCameraFound] = useState(false);
  const [noCameraPermission, setNoCameraPermission] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const SUPPORTED_VIDEO_TYPES = ["mp4", "webm", "ogg", "x-flv", "x-ms-wmv"];

  useEffect(() => {
    fetchIpvCode()
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setNoCameraFound(videoDevices.length === 0);
      });
  }, []);

  useEffect(() => {
    if (noCameraPermission) {
      setErrorContent("Webcam permission is necessary to complete KYC. You can continue on mobile app if you are facing an issue.")
    } else if (noCameraFound) {
      setErrorContent("You do not have a webcam, use mobile app to complete KYC");
    }
  }, [noCameraFound, noCameraPermission])

  const open = () => {
    setKnowMoreDialog(true)
  }

  const close = () => {
    setKnowMoreDialog(false)
  }

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

  const onFileSelectComplete = (file) => {
    setFile(file);
  }

  const onFileSelectError = () => {
    return toast('Please select video file only');
  }

  const handleSubmit = async () => {
    sendEvents('next')
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
    if (!showVideoRecoreder) {
      setShowVideoRecorder(!showVideoRecoreder);
    }
  }

  const onRecordingComplete = (videoBlob) => {
    const fileFromBlob = new File([videoBlob], "ipv-video.webm");
    setFile(fileFromBlob);
    setUploadCTAText("TAKE VIDEO AGAIN");
    steIsRecordingComplete(true);
  }

  const onVideoRecorderError = (error) => {
    setShowVideoRecorder(!showVideoRecoreder);
    setNoCameraPermission(!noCameraPermission);
  }

  const sendEvents = (userAction, type) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "selfie_video_doc",
        "type": type || "",
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const renderInitialIllustration = useCallback(() => {
    return (
      <div className="instructions-container" data-aid='instructions-container'>
        <div className="ipv_footer_instructions" data-aid='ipv-footer-instructions'>
          Start recording,{' '}
          <strong>by reading the following verification numbers loud</strong>{' '}
          while looking at the camera
        </div>
        <div className="ipv_code" data-aid='ipv-code'>{ipvcode}</div>
        <div style={{display: "flex", justifyContent: "center"}}>
          <img
            src={require(`assets/${productName}/state_ipv_number.svg`)}
            alt="Upload Selfie"
            className="default"
          />
        </div>
      </div>
    )
  },[ipvcode, productName])

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      events={sendEvents("just_set_events")}
      skelton={loading || isLoading}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Upload selfie video (IPV)"
      data-aid='kyc-selfie-video-ipv-screen'
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-ipv-video" data-aid='kyc-upload-ipv-video'>
          <div className="sub-title" data-aid='kyc-sub-title'>
            As per SEBI, it's compulsory for all investors to go through IPV (In
            Person Verification Process).
          </div>
          <KycUploadContainer dataAidSuffix="ipv">
            {errorContent &&
              <WVInfoBubble
                hasTitle
                type="error"
              >
                {errorContent}
              </WVInfoBubble>
            }
            {!isWeb && file && (
              <img
                src={require(`assets/${productName}/video_uploaded_placeholder.svg`)}
                className="preview"
                alt="Uploaded IPV Video"
              />
            )}
            {isWeb && !errorContent && (
              renderInitialIllustration()
            )}
            {!isWeb && !file && !errorContent && (
              renderInitialIllustration()
            )}
            {isWeb && showVideoRecoreder && !errorContent &&
              <VideoRecorder
                isOnInitially
                showReplayControls
                replayVideoAutoplayAndLoopOff
                onRecordingComplete={onRecordingComplete}
                countdownTime={15}
                onError={onVideoRecorderError}
              />
            }
            {isWeb && !showVideoRecoreder && !isRecordingComplete && !errorContent &&
              <KycUploadContainer.Button
                dataAid='open-camera-btn'
                type="outlined"
                buttonTitle="OPEN CAMERA"
                onClick={handleClick}
              />
            }
            {!isWeb && !errorContent &&
              <KycUploadContainer.Button
                dataAid='take-video-btn'
                type="outlined"
                buttonTitle={uploadCTAText}
                fileName="ipv_video"
                withPicker
                nativePickerMethodName="open_video_camera"
                onFileSelectComplete={onFileSelectComplete}
                onFileSelectError={onFileSelectError}
                supportedFormats={SUPPORTED_VIDEO_TYPES}
                fileHandlerParams={{
                  doc_type: "ipvvideo",
                  message: "Look at the screen and read the verification number loud",
                  ipv_code: ipvcode
                }}
              />
            }
          </KycUploadContainer>
          {!errorContent &&
            <div className="doc-upload-note-row" data-aid='doc-upload-note-row'>
              <div className="upload-note" data-aid='upload-note-text'>How to make a selfie video ?</div>
              <WVClickableTextElement
                color="secondary"
                className="know-more-button"
                onClick={() => open()}
              >
                KNOW MORE
              </WVClickableTextElement>
            </div>
          }
        </section>
      )}
      <KnowMore isOpen={showKnowMoreDialog} close={close} />
    </Container>
  )
}

export default IpvVideo
