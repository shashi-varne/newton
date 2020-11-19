import React from 'react';
import IconButton from 'material-ui/IconButton';
import DownwardIcon from 'assets/ic_down_arrow_white.svg';
import UpwardIcon from 'assets/ic_up_arrow_white.svg';

const PageFooter = ({ currentPage, totalPages, direction = 'down', onClick }) => {
  return (
    <div id="iwd-page-footer">
      <IconButton className="iwd-pf-btn" onClick={onClick}>
        <img
          src={direction === 'down' ? DownwardIcon : UpwardIcon}
          alt=""
        />
      </IconButton>
      <div id="iwd-pf-page-nos">
        <b>{currentPage}</b>|{totalPages}
      </div>
    </div>
  )
};

export default PageFooter;