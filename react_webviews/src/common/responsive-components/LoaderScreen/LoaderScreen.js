import React from 'react';
import ErrorScreen from '../ErrorScreen';

const LoaderScreen = ({
  loader = null,
  loadingText = '',
}) => {
  return (
    <ErrorScreen
      useTemplate={true}
      templateGraphic={loader}
      templateErrText={loadingText}
    />
  )
};

export default LoaderScreen;