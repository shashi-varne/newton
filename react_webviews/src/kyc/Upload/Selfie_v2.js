import "./commonStyles.scss";
import React, { useState, useRef } from 'react'
import Container from '../common/Container'
import { storageService, isEmpty } from '../../utils/validators'
import { storageConstants } from '../constants'
import { upload } from '../common/api'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig, getBase64 } from 'utils/functions'
import toast from '../../common/ui/Toast'
import useUserKycHook from '../common/hooks/userKycHook'
import Button from '../../common/ui/Button';
import WVLiveCamera from "../../common/ui/LiveCamera/WVLiveCamera";
import WVClickableTextElement from "../../common/ui/ClickableTextElement/WVClickableTextElement";
import { getGeoLocation, selfieUpload } from "../services";
import LocationPermission from "./LocationPermission";

const productName = getConfig().productName;
const isWeb = getConfig().isWebOrSdk;

const SelfieV2 = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [file, setFile] = useState(null);
  const [fileToShow, setFileToShow] = useState(null);
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [isLocnPermOpen, setIsLocnPermOpen] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [selfieLiveScore, setSelfieLiveScore] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const { kyc, isLoading } = useUserKycHook();
  const navigate = navigateFunc.bind(props)
  
  // const handleChange = (event) => {
  //   event.preventDefault();
  //   const uploadedFile = event.target.files[0]
  //   let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']

  //   if (acceptedType.indexOf(uploadedFile.type) === -1) {
  //     toast('Please select image file only')
  //     return
  //   }

  //   setFile(uploadedFile)
  //   getBase64(uploadedFile, function (img) {
  //     setFileToShow(img)
  //   })
  // }

  const handleSubmit = async () => {
    try {
      setIsApiRunning("button")
      const result = await upload(file, 'identification', {
        res: fileToShow,
        lat: locationData.lat,
        lng: locationData.lng,
        live_score: selfieLiveScore,
        kyc_product_type: 'equity'
      });
      storageService().setObject(storageConstants.KYC, result.kyc)
      navigate('/kyc/upload/progress')
    } catch (err) {
      console.error(err)
    } finally {
      console.log('uploaded')
      setIsApiRunning(false)
    }
  }

  // const locationCallbackSuccess = async (data) => {
  //   if (data.location_permission_denied) {
  //     navigate('/kyc/upload/selfie-location');
  //   } else {
  //     try {
  //       const results = await getGeoLocation(data.location);
  //       const country = results[0]?.formatted_address;
  //       if (country.toLowerCase() !== 'india') {
  //         navigate('/kyc/upload/selfie-location/invalid-region');
  //       } else {
    //       }
    //     } catch (err) {
      //       console.log(err);
      //       toast('Something went wrong! Please try again');
      //     }
      //   }
      // }

  const onLocationFetchSuccess = (data) => {
    setLocationData(data);
    setIsLocnPermOpen(false);
    setIsLiveCamOpen(true);
  }
      
  const openLiveCamera = () => {
    // window.callbackWeb.get_device_data({
    //   type: 'location_nsp_received',
    //   location_nsp_received: locationCallbackSuccess
    // });
    setIsLocnPermOpen(true);
  }

  const onFileUploadSuccess = async (result) => {
    setIsLiveCamOpen(false);
    if (result.imgBase64 && result['liveness-score']) {
      setFile(result.imgBase64);
      setFileToShow(result.imgBase64);
      setSelfieLiveScore(result['liveness-score']);
    }
  }

  const onFileUploadFailure = (error) => {
    setIsLiveCamOpen(false);
    toast(error.errorMsg || 'Something went wrong!');
  }

  const showSelfieSteps = () => {
    navigate('/kyc/upload/selfie-steps');
  }

  return (
    <Container
      buttonTitle="Upload"
      skelton={isLoading || showLoader}
      handleClick={handleSubmit}
      disable={!file}
      showLoader={isApiRunning}
      title="Take a selfie"
    >
      {/* TODO: Create a header title/subtitle component to be used everywhere */}
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan">
          <div className="sub-title">As per SEBI, selfie verification is mandatory to complete KYC</div>
          {/* TODO: Fix styling here as per design */}
          <div className="kyc-upload-selfie-title">
            Face should be clearly visible
          </div>
          <div className="kyc-doc-upload-container with-bg-color">
            {file && fileToShow && (
              <img src={fileToShow} className="preview" alt="" />
            )}
            {!file && (
              <img
                className="kduc-selfie-placeholder"
                src={require(`assets/${productName}/selfie_placeholder.svg`)}
                alt="Upload Selfie"
                width="320px"
              />
            )}
            <div className="kyc-upload-doc-actions">
              <Button
                fullWidth={true}
                variant="raised"
                size="large"
                color="secondary"
                onClick={openLiveCamera}
                autoFocus
                type="outlined"
                buttonTitle={file ? "Retake" : "Open Camera"}
              />
            </div>
          </div>
          <div className="kyc-selfie-intructions">
            <span id="kyc-si-text">How to take selfie?</span>
            <WVClickableTextElement onClick={showSelfieSteps}>
              Know More
            </WVClickableTextElement>
          </div>
          <WVLiveCamera
            open={isLiveCamOpen}
            onClose={() => setIsLiveCamOpen(false)}
            onFailure={onFileUploadFailure}
            onSuccess={onFileUploadSuccess}
          />
          <LocationPermission
            isOpen={isLocnPermOpen}
            onLocationFetchSuccess={onLocationFetchSuccess}
            parentProps={props}
          />
        </section>
      )}
    </Container>
  )
}

export default SelfieV2;
