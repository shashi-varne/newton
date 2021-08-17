/*
  Use: Can be used for page subtitles, styling as per Finwizard Component Design Standard

  Example syntax:
    -- Can be used with WVInPageHeader wrapper component (provides some extra layout styling) --
    <WVInPageHeader>
      <WVInPageTitle>Hello</WVInPageTitle>
      <WVInPageSubtitle>World</WVInPageSubtitle>
    </WVInPageHeader>

    OR
    -- Can be used by itself --
    <WVInPageSubtitle style={{ inline styling if required }}>
      Subtitle content
    </WVInPageSubtitle>
*/

import './commonStyles.scss';
import React from 'react';

const WVInPageSubtitle = ({ className, children, dataAidSuffix, ...props }) => {
  return (
    <div
      data-aid={`wv-ip-subtitle-${dataAidSuffix}`}
      {...props}
      className={`wv-ip-subtitle ${className}`}
    >
      {children}
    </div>
  );
}

export default WVInPageSubtitle;