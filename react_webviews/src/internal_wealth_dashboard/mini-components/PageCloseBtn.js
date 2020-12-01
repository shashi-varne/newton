import { Button } from 'material-ui';
import React, { memo } from 'react';
// -------------- Image Imports -----------------
import closeWhite from 'assets/ic_close_white.svg';
import closeGrey from 'assets/ic_close.svg';
// ----------------------------------------------
const iconColorMap = {
  white: closeWhite,
  grey: closeGrey,
};

const PageCloseBtn = ({ className = '', buttonClasses = {}, clickHandler, color = '' }) => {
  return (
    <div className={`iwd-page-close ${className}`}>
      <Button
        classes={{
          root: `iwd-pc-btn ${buttonClasses.root}`,
          label: buttonClasses.label,
        }}
        onClick={clickHandler}
      >
        <img src={iconColorMap[color] || closeGrey} alt="close" />
      </Button>
    </div>
  );
}

export default memo(PageCloseBtn);