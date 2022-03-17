import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import UiSkelton from '../../../common/ui/Skelton';
import { getConfig } from '../../../utils/functions';
import Icon from '../../atoms/Icon';

import './IframeContainer.scss';

const IframeContainer = ({
  isPageLoading,
  children,
  skeltonType,
  iframeRightSectionImgSrc,
  iframeRightSectionImgSrcProps,
  rightChildren,
}) => {
  const {isMobileDevice} = useMemo(getConfig,[]);
    console.log("rightChildren",rightChildren);
    console.log("iframeRightSectionImgSrc",iframeRightSectionImgSrc);
  return (
    <main className='iframe-container-wrapper'>
      <IframeLeftSection isPageLoading={isPageLoading} skeltonType={skeltonType}>
        {children}
      </IframeLeftSection>
      {(!rightChildren || !iframeRightSectionImgSrc) && !isMobileDevice && (
        <IframeRightSection isPageLoading={isPageLoading} skeltonType={skeltonType}>
          <>
            <Icon src={iframeRightSectionImgSrc} {...iframeRightSectionImgSrcProps} />
            {rightChildren}
          </>
        </IframeRightSection>
      )}
    </main>
  );
};

const IframeLeftSection = ({ children, isPageLoading, skeltonType }) => {
  return (
    <Box className='iframe-left-section'>
      {isPageLoading ? <UiSkelton type={skeltonType} /> : children}
    </Box>
  );
};

const IframeRightSection = ({ children, isPageLoading, skeltonType }) => {
  return (
    <Box className='iframe-right-section'>
      {isPageLoading ? <UiSkelton type={skeltonType} /> : children}
    </Box>
  );
};

export default IframeContainer;
