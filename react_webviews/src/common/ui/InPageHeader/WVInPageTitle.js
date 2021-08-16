/*
  Use: Can be used for page titles, styling as per Finwizard Component Design Standard

  Example syntax:
    -- Can be used with WVInPageHeader wrapper component (provides some extra layout styling) --
    <WVInPageHeader>
      <WVInPageTitle>Hello</WVInPageTitle>
      <WVInPageSubtitle>World</WVInPageSubtitle>
    </WVInPageHeader>

    OR
    -- Can be used by itself --
    <WVInPageTitle style={{ inline styling if required }}>
      Title content
    </WVInPageTitle>
*/

import './commonStyles.scss';
import React from 'react';

const WVInPageTitle = ({ className, children, dataAidSuffix, ...props }) => {
  return (
    <div className={`wv-ip-title ${className}`} {...props} data-aid={`wv-ip-title-${dataAidSuffix}`}>
      {children}
    </div>
  );
}

export default WVInPageTitle;