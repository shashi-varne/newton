import React from 'react';
import Grid from 'material-ui/Grid';

import './style.css';
import Input from './Input';

const MobileInputWithoutIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-end">

    <Grid item xs={12} className="MobileGrid">
      <Input
        {...props} />
    </Grid>
  </Grid>
);

export default MobileInputWithoutIcon;
