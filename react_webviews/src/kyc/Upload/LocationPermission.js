import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getConfig } from '../../utils/functions';
import { isFunction } from 'lodash';
import useScript from '../../common/customHooks/useScript';
import WVButton from '../../common/ui/Button/WVButton';
import WVFullscreenDialog from '../../common/ui/FullscreenDialog/WVFullscreenDialog';

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
  'verifying-location': {
    imgElem: locationIcon,
    title: 'Verifying location access',
    subtitle: 'As per SEBI, we need to capture your location while you take the selfie',
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
const GEOCODER = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCe5PrvBwabfWYOSftl0DlpGKan4o7se2A&libraries=&v=weekly"

const LocationPermission = ({
  isOpen,
  onClose,
  onInit, // callback to trigger (if any) for when google geocoder module is initialised
  onLocationFetchSuccess,
  onLocationFetchFailure,
  sendEvents
}) => {
  const [pageType, setPageType] = useState('verifying-location');
  const [pageContent, setPageContent] = useState({});
  const [permissionWarning, setPermissionWarning] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(true);
  const { isLoaded } = useScript(GEOCODER);

  useEffect(() => {
    if (isOpen) {
      requestLocnPermission();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLoaded) {
      onInit();
    }
  }, [isLoaded]);
  
  useEffect(() => {
    setPageContent(PAGE_TYPE_CONTENT_MAP[pageType]);
  }, [pageType]);

  const fetchCountryFromResults = (results) => {
    const addressObjs = results[0]?.address_components;
    const countryAddressObj = addressObjs.find(obj => obj.types.includes("country"));
    return countryAddressObj.long_name;
  }
  
  const locationCallbackSuccess = async (data) => {
    if (data.location_permission_denied) {
      setPageType('permission-denied');
      setPermissionWarning(true);
      setIsApiRunning(false);
    } else {
      setPermissionWarning(false);
      try {
        setIsApiRunning(true);        
        const geocoderService = new window.google.maps.Geocoder();
        geocoderService.geocode({
          location: {
            lat: data.location.lat,
            lng: data.location.lng,
          }
        }, (results, status) => {
          if (status === 'OK') {
            const country = fetchCountryFromResults(results);
            setIsApiRunning(false);
            if (country !== 'India') {
              setPageType("invalid-region");
            } else {
              onLocationFetchSuccess(data.location);
            }
          } else {
            throw(status);
          }
        });
      } catch (err) {
        console.log(err);
        setIsApiRunning(false);
        toast('Something went wrong! Please try again');
        if (isFunction(onLocationFetchFailure)) {
          onLocationFetchFailure();
        }
      }
    }
  }

  const requestLocnPermission = () => {
    setIsApiRunning(true);
    window.callbackWeb.get_device_data({
      type: 'location_nsp_received',
      location_nsp_received: locationCallbackSuccess
    });
  }

  const onCTAClick = () => {
    if (pageType === 'invalid-region') {
      onClose(pageType);
    } else {
      sendEvents('next', 'allow_location_access');
      requestLocnPermission();
    }
  }

  const onCloseIconClick = () => {
    sendEvents('back', 'allow_location_access');
    onClose(pageType);
  }

  if (!isOpen) {
    return '';
  }

  return (
    <WVFullscreenDialog
      open={isOpen}
      onClose={() => onClose(pageType)}
    >
      <WVFullscreenDialog.Content onCloseClick={onCloseIconClick}>
        <div className="kyc-loc-permission">
          <div className="kyc-loc-perm-illustration">
            {pageContent?.imgElem}
          </div>
          <div className="kyc-loc-perm-title">
            {pageContent?.title}
          </div>
          <div className="kyc-loc-perm-subtitle">
            {pageContent?.subtitle}
          </div>
          {permissionWarning &&
            <WVInfoBubble type="error">
              Location is required to continue the KYC
            </WVInfoBubble>
          }
        </div>
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <WVButton
          fullWidth
            style={{ display: 'flex', margin: 'auto' }}
          onClick={onCTAClick}
          variant="outlined"
          color="secondary"
          showLoader={isApiRunning}
        >
          {pageType === 'invalid-region' ? "Okay" : "Allow"}
        </WVButton>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
}

export default LocationPermission;