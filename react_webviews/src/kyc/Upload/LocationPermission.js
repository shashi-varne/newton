import React, { useEffect, useState } from 'react';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getConfig } from '../../utils/functions';
import isFunction from 'lodash/isFunction';
import WVButton from '../../common/ui/Button/WVButton';
import WVFullscreenDialog from '../../common/ui/FullscreenDialog/WVFullscreenDialog';
import { validateLocation } from '../services';

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
const DEFAULT_PAGE_CONFIG = {
  imgElem: locationIcon,
  title: 'Allow location access',
  subtitle: 'As per SEBI, we need to record your location while you take the selfie',
  buttonText: 'Allow'
};
const PAGE_TYPE_CONTENT_MAP = {
  'permission-denied': DEFAULT_PAGE_CONFIG,
  'verifying-location': {
    ...DEFAULT_PAGE_CONFIG,
    title: 'Verifying location access',
  },
  'location-fetch-failed': {
    ...DEFAULT_PAGE_CONFIG,
    title: 'Unable to identify location',
    subtitle: 'We are currently unable to identify your location. Please try again or contact Support for further help',
    buttonText: 'Try Again'
  },
  'invalid-region': {
    imgElem: foreignLocationIcon,
    title: 'You cannot proceed with KYC',
    subtitle: 'As per SEBI regulations, your location should be in India',
    buttonText: 'Okay'
  },
};

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

  useEffect(onInit, []);

  useEffect(() => {
    if (isOpen) {
      requestLocnPermission();
    }
  }, [isOpen]);
  
  useEffect(() => {
    setPageContent(PAGE_TYPE_CONTENT_MAP[pageType]);
  }, [pageType]);

  const verifyLocationRegion = async (data = {}) => {
    const coordinates = {
      lat: data.location?.lat,
      lng: data.location?.lng,
    };

    try {
      setIsApiRunning(true);

      const result = await validateLocation(coordinates);
      setIsApiRunning(false);
      
      if (result.location_verified) {
        onLocationFetchSuccess();
      } else {
        setPageType("invalid-region");
      }
    } catch (err) {
      console.log(err);
      setIsApiRunning(false);
      setPageType('location-fetch-failed');
      if (isFunction(onLocationFetchFailure)) {
        onLocationFetchFailure();
      }
    }
  }

  const locationCallbackSuccess = async (data) => {
    if (data.location_permission_denied) {
      setPageType('permission-denied');
      setPermissionWarning(true);
      setIsApiRunning(false);
    } else {
      setPermissionWarning(false);
      verifyLocationRegion(data);
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
      sendEvents('back', 'allow_location_access');
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
      onClose={onCloseIconClick}
    >
      <WVFullscreenDialog.Content>
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
          {pageContent.buttonText}
        </WVButton>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
}

export default LocationPermission;