import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { getConfig } from 'utils/functions';
import UiSkelton from '../../../common/ui/Skelton';
import IframeContainer from '../IframeContainer/IframeContainer';


// have a iframeProps for Iframe container.
const ContainerMain = (props) => {
  const { isIframe } = useMemo(getConfig, []);
  const {
    children,
    isPageLoading,
    skeltonType,
    iframeRightChildren,
    iframeRightSectionImgSrc,
    iframeRightSectionImgSrcProps,
    noPadding,
    disableHorizontalPadding,
    disableVerticalPadding,
    sx,
  } = props;

  if (isIframe) {
    return (
      <IframeContainer
        isPageLoading={isPageLoading}
        skeltonType={skeltonType}
        rightChildren={iframeRightChildren}
        iframeRightSectionImgSrc={iframeRightSectionImgSrc}
        iframeRightSectionImgSrcProps={iframeRightSectionImgSrcProps}
      >
        {children}
      </IframeContainer>
    );
  } else {
    return (
      <Box
        sx={{ ...containersx(noPadding, disableHorizontalPadding, disableVerticalPadding), ...sx }}
        className={`container-content-wrapper`}
      >
        {isPageLoading ? <UiSkelton type={skeltonType} /> : children}
      </Box>
    );
  }
};

const containersx = (noPadding, disableHorizontalPadding, disableVerticalPadding) => {
  if (noPadding) {
    return {
      p: '0px !important',
    };
  }
  if (disableHorizontalPadding) {
    return {
      px: '0px !important',
    };
  }
  if (disableVerticalPadding) {
    return {
      py: '0px !important',
    };
  }
};

export default ContainerMain;
