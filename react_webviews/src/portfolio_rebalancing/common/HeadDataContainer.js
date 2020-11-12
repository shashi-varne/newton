import React from 'react';
import Typography from '@material-ui/core/Typography';

import './Style.scss';
const HeadDataContainer = ({ title, children, errorHeading }) => {
  return (
    <div className='head-data-container'>
      <Typography className={`title-heading ${errorHeading && 'error-heading-page'}`}>
        {title}
      </Typography>
      <div>{children}</div>
    </div>
  );
};

export default HeadDataContainer;
