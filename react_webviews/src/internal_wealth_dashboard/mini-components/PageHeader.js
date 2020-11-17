import React, { memo } from 'react';
import IwdProfile from './IwdProfile';

const PageHeader = (props) => {
  const { backgroundColor = 'inherit', height = 'auto', hideProfile = false } = props;

  return (
    <header
      id="iwd-page-header"
      style={{
        // backgroundColor,
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
    </header>
  );
};

export default memo(PageHeader);