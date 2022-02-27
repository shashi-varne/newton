import React, { useMemo } from 'react';
import { getConfig } from 'utils/functions';
import UiSkelton from '../../../common/ui/Skelton';
import IframeContainer from '../IframeContainer/IframeContainer';

const ContainerMain = (props) => {
  const { isMobileDevice, isIframe } = useMemo(getConfig, []);
  const {
    children,
    isPageLoading,
    skeltonType,
    iframeRightChildren,
    iframeRightSectionImgSrc,
    iframeRightSectionImgSrcProps,
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
      <main className={`container-content-wrapper`}>
        {isPageLoading ? <UiSkelton type={skeltonType} /> : children}
      </main>
    );
  }
};

export default ContainerMain;
