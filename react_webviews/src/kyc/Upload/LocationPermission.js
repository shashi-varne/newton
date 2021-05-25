import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getConfig } from '../../utils/functions';
import { getGeoLocation } from '../services';
import { navigate as navigateFunc } from '../common/functions';
import { isFunction } from 'lodash';
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

const LocationPermission = ({
  isOpen,
  onClose,
  type,
  onLocationFetchSuccess,
  onLocationFetchFailure,
  parentProps
}) => {
  const [pageType, setPageType] = useState(type || 'permission-denied');
  const [pageContent, setPageContent] = useState({});
  const [permissionWarning, setPermissionWarning] = useState(false);
  const navigate = navigateFunc.bind(parentProps);

  useEffect(() => {
    if (isOpen) {
      requestLocnPermission();
    }
  }, [isOpen]);

  useEffect(() => {
    setPageContent(PAGE_TYPE_CONTENT_MAP[pageType]);
  }, [pageType]);

  const locationCallbackSuccess = async (data) => {
    if (data.location_permission_denied) {
      setPermissionWarning(true);
    } else {
      try {
        // const results = await getGeoLocation(data.location);
        // const country = results[0]?.formatted_address;

        // if (country !== 'India') {
        //   setPageType("invalid-region");
        // } else {
          onLocationFetchSuccess(data.location);
        // }
      } catch (err) {
        console.log(err);
        toast('Something went wrong! Please try again');
        if (isFunction(onLocationFetchFailure)) {
          onLocationFetchFailure();
        }
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
      navigate('/kyc/journey');
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
      onClose={onClose}
    >
      <WVFullscreenDialog.Content onCloseClick={onClose}>
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
          onClick={onCTAClick}
          variant="outlined"
          color="secondary"
        >
          {pageType === 'invalid-region' ? "Okay" : "Allow"}
        </WVButton>
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
}

export default LocationPermission;