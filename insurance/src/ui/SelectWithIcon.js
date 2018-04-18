import React from 'react';
import Grid from 'material-ui/Grid';

import './style.css';
import Input from './Input';
import Icon from './Icon';

const SelectWithIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-end">
    <Grid item xs={2}>
      <Icon
        src={props.icon}
        width={props.width} />
    </Grid>
    <Grid item xs={10}>
      
    </Grid>
  </Grid>
);

export default SelectWithIcon;
