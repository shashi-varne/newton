import React from 'react';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';

const Toggle = (props) => {
  const {
    checked,
    dataAid,
    classes,
    onChange,
    disabled,
    required,
    className,
    ...restProps
  } = props;
  return (
    <Switch
      data-aid={`toggle_${dataAid}`}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={className}
      classes={classes}
      {...restProps}
    />
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  dataAid: PropTypes.string,
};

export default Toggle;
