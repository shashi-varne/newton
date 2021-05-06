import React, { useState } from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/functions';
import { StatusInfo } from "../mini-components/StatusInfo";
import "./commonStyles.scss";

const Allow = (props) => {
  const [showLocationError, setShowLocationError] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const navigate = navigateFunc.bind(props);

  const accessHandler = () => {
    if (navigator.onLine) {
      navigator.geolocation.getCurrentPosition(allowAccess, denyAccess)
    }
  }

  const allowAccess = (position) => {
    console.log("location accessed");
    const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
    console.log(data);
    setLocationData(data);
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
      hidePageTitle
      buttonTitle="ALLOW"
      handleClick={accessHandler}
      headerData={{ goBack }}
      disableBack
    >
      <section id="allow-location">
        <StatusInfo
          icon="location.svg"
          title="Allow location access"
          subtitle="As per SEBI, we need to capture your location while you take the selfie"
        />
        {showLocationError && 
          <div className="location-error">
            {/* todo: error note component to be added */}
            Location is required to continue
            the KYC
          </div>
        }
      </section>
    </Container>
  )
}

export default Allow;
