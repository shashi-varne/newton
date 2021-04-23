import React from 'react';
import Grid from 'material-ui/Grid';

import './style.scss';
import Input from './Input';
import Icon from './Icon';

const InputWithIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-end" className={props.error ? 'align-center' : ''}>
    <Grid item xs={2}>
      {props.icon && <Icon
        src={props.icon}
        width={props.width} />}
    </Grid>
    <Grid item xs={10}>
      <Input
        {...props} />
    </Grid>
  </Grid>
);

export default InputWithIcon;
