import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';

import './InputField.scss';

const InputField = (props) => {
  const {
    label,
    helperText,
    error,
    inputProps,
    inputLabelProps,
    prefix,
    suffix,
    disabled,
    onChange,
    defaultValue,
    value,
    autoFocus,
    placeholder,
    required,
    variant,
    onPrefixClick,
    onSuffixClick,
    type,
    size,
    fullWidth,
    dataAid,
    InputProps,
    className,
    inputMode,
    ...restProps
  } = props;

  /*
    this will dynamically change the position of suffix.
    if type is string, it will palce it in right-bottom, else it will be placed at right-center.
  */
  const applySuffixStringTypeStyle = typeof suffix === 'string';

  const suffixStyle = () => {
    if (applySuffixStringTypeStyle) {
      return { root: 'inputSuffix-string' };
    }
    return {};
  };

  const InputPrefix = () => {
    if (prefix) {
      return (
        <InputAdornment
          disableTypography={disabled}
          disablePointerEvents={disabled}
          position='start'
        >
          <div
            className={`input-field-prefix-wrapper ${onPrefixClick && 'if-prefix-clickable'}`}
            onClick={onPrefixClick}
          >
            {prefix}
          </div>
        </InputAdornment>
      );
    } else {
      return null;
    }
  };
  const InputSuffix = () => {
    if (suffix) {
      return (
        <InputAdornment
          disableTypography={disabled}
          disablePointerEvents={disabled}
          classes={suffixStyle()}
          position='end'
        >
          <div
            className={`input-field-suffix-wrapper ${onSuffixClick && 'if-suffix-clickable'}`}
            onClick={onSuffixClick}
          >
            {applySuffixStringTypeStyle ? (
              <Typography variant='body2'>{suffix}</Typography>
            ) : (
              suffix
            )}
          </div>
        </InputAdornment>
      );
    } else {
      return null;
    }
  };
  return (
    <TextField
      label={label}
      variant={variant}
      helperText={helperText}
      data-aid={`inputField_${dataAid}`}
      error={error}
      className={`input-field-wrapper ${className}`}
      disabled={disabled}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      placeholder={placeholder}
      size={size}
      required={required}
      type={type}
      InputLabelProps={{
        'data-aid': 'tv_label',
        ...inputLabelProps
      }}
      FormHelperTextProps={{
        'data-aid': 'tv_helperText',
      }}
      InputProps={{
        startAdornment: InputPrefix(),
        endAdornment: InputSuffix(),
        inputProps:{
          "data-aid": "et_text",
          inputMode: inputMode,
          ...inputProps,
        },
        ...InputProps,
      }}
      {...restProps}
    />
  );
};

export default InputField;

InputField.defaultProps = {
  type: 'text',
  variant: 'filled',
  inputProps: {},
  fullWidth: true,
};

InputField.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.node,
  error: PropTypes.bool,
  inputProps: PropTypes.object,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['medium', 'small']),
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'outlined']),
};
