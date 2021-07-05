// DUMMY COMPONENT TO MOCK THE BEHAVIOUR FOR SELFIE LOCATION PERMISSION CHECK

import React, { useEffect, useState } from 'react';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getConfig } from '../../utils/functions';
import WVButton from '../../common/ui/Button/WVButton';
import WVFullscreenDialog from '../../common/ui/FullscreenDialog/WVFullscreenDialog';
import WVButtonLayout from '../../common/ui/ButtonLayout/WVButtonLayout';

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
  'dummy-page': {
    imgElem: locationIcon,
    title: 'Dummy Location Test Page',
    subtitle: 'As per SEBI regulations, we must stalk you'
  }
};
const dummyLocationObj = {
  lat: "16.235325464545348",
  lng: "80.049525743162405",
}

const LocationPermDummy= ({
  isOpen,
  onClose,
  onInit, // callback to trigger (if any) for when google geocoder module is initialised
  onLocationFetchSuccess,
  onLocationFetchFailure,
}) => {
  const [pageType, setPageType] = useState('verifying-location');
  const [pageContent, setPageContent] = useState({});
  const [permissionWarning, setPermissionWarning] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      requestLocnPermission();
    }
  }, [isOpen]);

  useEffect(() => {
    onInit();
  });
  
  useEffect(() => {
    setPageContent(PAGE_TYPE_CONTENT_MAP[pageType]);
  }, [pageType]);
  
  const locationCallbackSuccess = async (data) => {
    setIsApiRunning(false);
    if (data.location_permission_denied) {
      setPageType('permission-denied');
      setPermissionWarning(true);
    } else {
      setPermissionWarning(false);
      setPageType('dummy-page');
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
      requestLocnPermission();
    }
  }

  if (!isOpen) {
    return '';
  }

  return (
    <WVFullscreenDialog
      open={isOpen}
      onClose={() => onClose(pageType)}
    >
      <WVFullscreenDialog.Content onCloseClick={() => onClose(pageType)}>
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
      <WVFullscreenDialog.Action style={{ display: 'flex', justifyContent: 'center' }}>
        {pageType === 'dummy-page' ? 
          <WVButtonLayout>
            <WVButtonLayout.Button outlined onClick={() => setPageType("invalid-region")}>
              NRI
            </WVButtonLayout.Button>
            <WVButtonLayout.Button contained onClick={() => onLocationFetchSuccess(dummyLocationObj)}>
              Indian
            </WVButtonLayout.Button>
          </WVButtonLayout>
          : <WVButton
            fullWidth
              style={{ display: 'flex', margin: 'auto' }}
            onClick={onCTAClick}
            variant="outlined"
            color="secondary"
            showLoader={isApiRunning}
          >
            {pageType === 'invalid-region' ? "Okay" : "Allow"}
          </WVButton>
        }
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
}

export default LocationPermDummy;