import React, { useState } from 'react'
import Container from '../common/Container'
import { getConfig } from '../../utils/functions'
import { navigate as navigateFunc } from '../common/functions'
import "./Location.scss";

const productName = getConfig().productName;

const Allow = (props) => {
  const [showLocationError, setShowLocationError] = useState(false);
  const navigate = navigateFunc.bind(props);

  const accessHandler = () => {
    if (navigator.onLine) {
      navigator.geolocation.getCurrentPosition(allowAccess, denyAccess)
    }
  }

  const allowAccess = () => {
    console.log("location accessed");
    // navigate("path")
  }

  const denyAccess = () => {
    console.log("location denied");
    setShowLocationError(true);
  }
  const goBack = () => {
    // navigate('path')
  }
  
  return (
    <Container
      force_hide_inpage_title={true}
      buttonTitle="ALLOW"
      handleClick={accessHandler}
      headerData={{ goBack }}
      disableBack
    >
      <section id="allow-location">
        <div className="flex-justify-center">
          <img
            src={require(`assets/${productName}/location.svg`)}
            className="location-icon"
            alt="location"
          />
        </div>
        <div className="page-desc">
          <div className="page-title">
            Allow location access
          </div>
          <div className="page-subtitle">
            As per SEBI, we need to capture your location while you take the selfie
          </div>
        </div>
        {showLocationError && 
          <div className="location-error">
            Location is required to continue
            the KYC
          </div>
        }
      </section>
    </Container>
  )
}

export default Allow;
