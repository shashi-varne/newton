import React from 'react';
import ErrorScreen from '../ErrorScreen';

const LoaderScreen = ({
  loader = null,
  loadingText = '',
  ...otherProps
}) => {
  return (
    <ErrorScreen
      useTemplate={true}
      templateGraphic={loader}
      templateErrText={loadingText}
      {...otherProps}
    />
  )
};

export default LoaderScreen;