import React from 'react';
import { CircularProgress } from 'material-ui';
import LoaderScreen from '../../common/responsive-components/LoaderScreen';

export default function CardLoader({ size = 50, thickness = 4, loadingText }) {
  return (
    <LoaderScreen
      loader={<CircularProgress size={size} thickness={thickness} />}
      loadingText={loadingText}
    />
  );
}