import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    fontSize: '65px',
  },
};
const Report = ({ title, children, classes, subTitle }) => {
  return (
    <>
      <Typography
        style={{
          fontSize: '15px',
          fontWeight: '500',
          color: '#4A4A4A',
          margin: '1em 0',
          padding: '0 15px',
        }}
      >
        {title}
        {subTitle && <span className='fd-report-subtitle'>{subTitle}</span>}
      </Typography>
      <div>{children}</div>
    </>
  );
};

export default withStyles(styles)(Report);
