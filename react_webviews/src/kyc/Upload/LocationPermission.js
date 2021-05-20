import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getConfig } from '../../utils/functions';
import Container from '../common/Container';
import { getGeoLocation } from '../services';
import Close from '@material-ui/icons/Close';
import { navigate as navigateFunc } from '../common/functions';
import { isFunction } from 'lodash';

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

const LocationPermission = ({
  isOpen,
  type,
  onLocationFetchSuccess,
  onLocationFetchFailure,
  parentProps
}) => {
  const [pageType, setPageType] = useState(type || 'no-permission');
  const [pageContent, setPageContent] = useState({});
  const [isApiRunning, setIsApiRunning] = useState(false);
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
      setPageType("permission-denied");
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
      setIsApiRunning(false);
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
      navigate('/kyc/journey');
    } else {
      requestLocnPermission();
    }
  }

  const goBack = () => {
    if (pageType === 'invalid-region') {
      navigate('/kyc/journey');
    } else {
      parentProps.history.goBack();
    }
  }

  if (!isOpen) {
    return '';
  }

  return (
    <Dialog
      fullScreen={true}
      open={isOpen}
      onClose={goBack}
      className="kyc-selfie-location-dialog"
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <Close />
        {isApiRunning ?
          LoadingContent :
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
            {pageType === 'permission-denied' &&
              <WVInfoBubble type="error">
                Location is required to continue the KYC
            </WVInfoBubble>
            }
          </div>
        }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCTAClick}
          variant="outlined"
          color="secondary"
          autoFocus
          fullWidth
        >
          {pageType === 'invalid-region' ? "Okay" : "Allow"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LocationPermission;

const LoadingContent = (
  <div>Verifying Location</div>
);

/* <Container
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
    </Container> */