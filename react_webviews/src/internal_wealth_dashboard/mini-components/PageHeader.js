import React, { memo } from 'react';
import IwdProfile from './IwdProfile';
import { getConfig } from "utils/functions";
import { isUndefined } from 'lodash';

const isMobileView = getConfig().isMobileDevice;

const PageHeader = (props) => {
  let { height, hideProfile } = props;

  if (!height) {
    height = isMobileView ? 'auto' : '9vh';
  }

  if (isUndefined(hideProfile)) {
    hideProfile = isMobileView;
  }

  return (
    <div
      id="iwd-page-header"
      style={{
        height,
      }}
    >
      <div id="iwd-ph-left">
        {{...props.children}}
      </div>
      {!hideProfile &&
        <div id="iwd-ph-right">
          <IwdProfile />
        </div>
      }
    </div>
  );
};

export default memo(PageHeader);