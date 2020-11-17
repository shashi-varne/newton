import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const PageFooter = ({ currentPage, totalPages, direction = 'down' }) => {
  return (
    <div id="iwd-page-footer">
      <IconButton className="iwd-pf-btn">
        {direction === 'down' ?
          <ArrowDownwardIcon /> :
          <ArrowUpwardIcon />
        }
      </IconButton>
      <div id="iwd-pf-page-nos">
        <b>{currentPage}</b>|{totalPages}
      </div>
    </div>
  )
};

export default PageFooter;