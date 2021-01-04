// ----------------------- Assets -----------------------
import IlsError from 'assets/fisdom/ils_error.svg';
import IlsNoData from 'assets/fisdom/ils_no_data.svg';
import IlsNoDataMob from 'assets/fisdom/ils_no_data_mob.svg';
// ------------------------------------------------------
import React from 'react';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
import { getConfig } from "utils/functions";

const isMobileView = getConfig().isMobileDevice;

const IwdErrorScreen = ({
  hasError = false, // flag to show 'error' image
  hasNoData = false, // flag to show 'no data' image
  ...props
}) => {
  const renderImage = () => {
    if (hasError) {
      return IlsError;
    } else if (hasNoData) {
      return isMobileView ? IlsNoDataMob : IlsNoData;
    }
    return props.templateImage;
  };

  return (
    <ErrorScreen
      useTemplate={true}
      templateImage={renderImage()}
      classes={{
        container: `iwd-fade ${(props.classes || {}).container}`
      }}
      {...props}
    />
  );
};

export default IwdErrorScreen;