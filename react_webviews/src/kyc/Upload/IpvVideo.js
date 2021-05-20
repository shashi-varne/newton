import React, { useState, useEffect, useRef } from 'react'
import VideoRecorder from 'react-video-recorder'
import Container from '../common/Container'
import Button from '../../common/ui/Button'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { getIpvCode, upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import toast from '../../common/ui/Toast'
import KnowMore from '../mini-components/IpvVideoKnowMore'
import useUserKycHook from '../common/hooks/userKycHook'
import "./commonStyles.scss";

const IpvVideo = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ipvcode, setIpvCode] = useState('')
  const {kyc, isLoading} = useUserKycHook();
  const [showKnowMoreDialog, setKnowMoreDialog] = useState(false)
  const [showVideoRecoreder, setShowVideoRecorder] = useState(false)

  const open = () => {
    setKnowMoreDialog(true)
  }

  const close = () => {
    setKnowMoreDialog(false)
  }

  const inputEl = useRef(null)

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
  
  const handleChange = (event) => {
    event.preventDefault();
    const uploadedFile = event.target.files[0]
    let acceptedTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/x-flv',
      'video/x-ms-wmv',
    ]
    if (acceptedTypes.includes(uploadedFile.type)) {
      setFile(event.target.files[0])
    } else {
      toast('Upload a valid file format')
    }
  }

  const handleUpload = (method_name) => {
    if(getConfig().html_camera)
      inputEl.current.click()
    else
      native_call_handler(method_name, 'ipvvideo', '', '', 'Look at the screen and read the verification number loud', ipvcode)
  }

  const handleSubmit = async () => {
    const navigate = navigateFunc.bind(props)
    try {
      setIsApiRunning("button")
      const response = await upload(file, 'ipvvideo', { ipv_code: ipvcode })
      if(response.status_code === 200) {
        const result = response.result
        storageService().setObject(storageConstants.KYC, result.kyc)
        navigate('/kyc/upload/progress')
      } else {
        throw new Error(response?.result?.error || response?.result?.message || "Something went wrong")
      }
    } catch (err) {
      toast(err?.message)
      console.error(err)
    } finally {
      setIsApiRunning(false)
    }
  }

  const handleClick = (e) => {
    if (!showVideoRecoreder) {
      setShowVideoRecorder(true);
    }
  }

  const productName = getConfig().productName
  const isWeb = getConfig().isWebOrSdk

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
          {!isWeb && (
            <div className="kyc-doc-upload-container">
              {file && (
                <img
                  src={require(`assets/${productName}/video_uploaded_placeholder.svg`)}
                  className="preview"
                  alt="Uploaded IPV Video"
                />
              )}
              {!file && (
                <img
                  className="icon"
                  src={require(`assets/${productName}/card_upload_selfie.svg`)}
                  alt="Upload Selfie"
                  width="320px"
                  style={{ display: 'block', margin: '0 auto', width: '320px' }}
                />
              )}
              <div className="kyc-upload-doc-actions">
                <div className="open-camera">
                  <input
                    ref={inputEl}
                    type="file"
                    className="kyc-upload"
                    onChange={handleChange}
                    accept="video/*"
                    capture
                  />
                  <button
                    data-click-type="camera-front"
                    onClick={() => handleUpload("open_video_camera")}
                    className="kyc-upload-button"
                  >
                    {!file && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g transform="translate(0 3)">
                          <path d="M17.03125,2.79581152 L16.4375,0.534031414 C16.34375,0.219895288 16.0625,0 15.71875,0 L8.28125,0 C7.9375,0 7.65625,0.219895288 7.5625,0.534031414 L6.96875,2.79581152 L2.8125,2.79581152 C1.25,2.79581152 0,4.05235602 0,5.62303665 L0,15.1727749 C0,16.7434555 1.25,18 2.8125,18 L21.1875,18 C22.75,18 24,16.7434555 24,15.1727749 L24,5.62303665 C24,4.05235602 22.75,2.79581152 21.1875,2.79581152 L17.03125,2.79581152 Z M23,5.79400749 L23,14.9026217 C23,16.071161 22.0631868,17 20.8846154,17 L3.11538462,17 C1.93681319,17 1,16.071161 1,14.9026217 L1,5.79400749 C1,4.62546816 1.93681319,3.69662921 3.11538462,3.69662921 L7.34615385,3.69662921 C7.49725275,3.69662921 7.61813187,3.60674157 7.64835165,3.48689139 L8.28296703,1.08988764 C8.28296703,1.05992509 8.34340659,1 8.37362637,1 L15.5961538,1 C15.6565934,1 15.6868132,1.02996255 15.6868132,1.08988764 L16.3214286,3.48689139 C16.3516484,3.60674157 16.4725275,3.69662921 16.6236264,3.69662921 L20.8543956,3.69662921 C22.0631868,3.69662921 23,4.62546816 23,5.79400749 Z" />
                          <path d="M12,15 C9.23076923,15 7,12.7692308 7,10 C7,7.23076923 9.23076923,5 12,5 C14.7692308,5 17,7.23076923 17,10 C17,12.7692308 14.7692308,15 12,15 Z M12,14 C14.216946,14 16,12.216946 16,10 C16,7.78305398 14.216946,6 12,6 C9.78305398,6 8,7.78305398 8,10 C8,12.216946 9.78305398,14 12,14 Z" />
                        </g>
                      </svg>
                    )}
                    <div className="upload-action">open camera</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {isWeb && (
            <div className="kyc-doc-upload-container noBorder">
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
              {showVideoRecoreder && 
                <VideoRecorder
                  showReplayControls
                  replayVideoAutoplayAndLoopOff
                  onRecordingComplete={videoBlob => {
                    // Do something with the video...
                    console.log('videoBlob', videoBlob)
                    const fileFromBlob = new File([videoBlob], "ipv-video.webm");
                    setFile(fileFromBlob);
                  }}
                />
              }
              <div className="kyc-upload-doc-actions">
                {!file && 
                  <div className="button-container">
                    <Button
                      type="outlined"
                      buttonTitle="OPEN CAMERA"
                      onClick={handleClick}
                      disable={showVideoRecoreder}
                    />
                  </div>
                }
              </div>
            </div>
          )}
          <div className="flex-between-center">
            <div className="know_more">How to make a selfie video ?</div>
            <div className="link" onClick={() => open()}>
              KNOW MORE
            </div>
          </div>
        </section>
      )}
      <KnowMore isOpen={showKnowMoreDialog} close={close} />
    </Container>
  )
}

export default IpvVideo
