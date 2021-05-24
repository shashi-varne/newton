import React, { useState } from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/functions';
import { StatusInfo } from "../mini-components/StatusInfo";
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";
import {nativeCallback} from '../../../utils/native_callback';
import "./commonStyles.scss";

const Allow = (props) => {
  const [showLocationError, setShowLocationError] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const navigate = navigateFunc.bind(props);

  const accessHandler = () => {
    sendEvents('next')
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
    sendEvents('back')
    // navigate('path')
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'trading_onboarding',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "allow_location_access",
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  return (
    <Container
      hidePageTitle
      buttonTitle="ALLOW"
      events={sendEvents("just_set_events")}
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
            <WVInfoBubble
            type="error"
            isDismissable
            isOpen={showLocationError}
            >
              Location is required to continue the KYC
            </WVInfoBubble>
          </div>
        }
      </section>
    </Container>
  )
}

export default Allow;
