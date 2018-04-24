import React from 'react';
import Grid from 'material-ui/Grid';

import './style.css';
import Input from './Input';
import Icon from './Icon';

const InputWithIcon = (props) => (
  <Grid container spacing={16} alignItems="flex-end">
    <Grid item xs={2}>
      {props.icon && <Icon
        src={props.icon}
        width={props.width} />}
    </Grid>
    <Grid item xs={10}>
      <Input
        disabled={props.disabled}
        type={props.type}
        fullWidth={true}
        value={props.value}
        required={true}
        shrink={props.shrink}
        class={props.class}
        id={props.id}
        label={props.label}
        onChange={props.onChange} />
    </Grid>
  </Grid>
);

export default InputWithIcon;
