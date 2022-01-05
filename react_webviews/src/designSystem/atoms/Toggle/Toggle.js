import React from 'react';
import Switch from '@mui/material/Switch';
const Toggle = (props) => {
  const {
    label,
    checked,
    classes,
    onChange,
    disabled,
    disableRipple,
    ...restProps
  } = props;
  return (
    <Switch
      label={label}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      disableRipple={disableRipple}
      classes={classes}
      {...restProps}
    />
  );
};

export default Toggle;
