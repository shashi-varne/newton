import React, { useEffect, useState } from 'react';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getConfig } from '../../utils/functions';
import Container from '../common/Container';

const { productName } = getConfig();
const locationIcon = (
  <div className="kyc-loc-perm-icon">
    <img src={require(`assets/${productName}/ic_document_location.svg`)} alt="" />
  </div>
);
const foreignLocationIcon = (
  <img
    src={require(`assets/${productName}/foreign-location.svg`)}
    alt="foreign location error"
  />
);
const PAGE_TYPE_CONTENT_MAP = {
  'permission-denied': {
    imgElem: locationIcon,
    title: 'Allow location access',
    subtitle: 'As per SEBI, we need to capture your location while you take the selfie',
  },
  'no-permission': {
    imgElem: locationIcon,
    title: 'Enable phone location',
    subtitle: 'You need to turn on your phone location before taking the selfie',
  },
  'invalid-region': {
    imgElem: foreignLocationIcon,
    title: 'You cannot proceed with KYC',
    subtitle: 'As per SEBI regulations, your location should be in India',
  },
  'default': {
    imgElem: locationIcon,
    title: 'Allow location access',
    subtitle: 'As per SEBI, we need to capture your location while you take the selfie'
  }
};

const LocationPermission = (props) => {
  const type = props.match?.params?.type || '';
  const [pageType, setPageType] = useState(type || 'no-permission');
  const [pageContent, setPageContent] = useState({});
  const [country, setCountry] = useState('Uganda');

  useEffect(() => {
    setPageContent(PAGE_TYPE_CONTENT_MAP[pageType]);
  }, [pageType]);

  const locationCallbackSuccess = (data) => {
    if (data.location_permission_denied) {
      setPageType("permission-denied");
    } else {
      // TODO: Call location country fetch API here
      if (country !== 'India') {
        setPageType("invalid-region")
      } else {

      }
    }
  }

  const requestLocnPermission = () => {
    window.callbackWeb.get_device_data({
      type: 'location_nsp_received',
      location_nsp_received: locationCallbackSuccess
    });
  }

  const onCTAClick = () => {
    if (pageType === 'invalid-region') {
      // TODO: Take user to journey screen
      props.history.goBack();
    } else {
      requestLocnPermission();
    }
  }

  const goBack = () => {
    if (pageType === 'invalid-region') {
      // TODO: Take user to journey screen
      props.history.goBack();
    } else {
      props.history.goBack();
    }
  }

  return (
    <Container
      disableBack
      buttonTitle={pageType === 'invalid-region' ? "Okay" : "Allow"}
      handleClick={onCTAClick}
      headerData={{ goBack }}
    >
      <div className="kyc-loc-permission">
        {pageContent?.imgElem}
        <div className="kyc-loc-perm-title">
          {pageContent?.title}
        </div>
        <div className="kyc-loc-perm-subtitle">
          {pageContent?.subtitle}
        </div>
        {pageType === 'permission-denied' &&
          <WVInfoBubble type="error">
            Location is required to continue the KYC
          </WVInfoBubble>
        }
      </div>
    </Container>
  );
}

export default LocationPermission;