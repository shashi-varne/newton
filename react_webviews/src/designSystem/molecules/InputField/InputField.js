import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import './InputField.scss';

const InputField = (props) => {
  const {
    label,
    helperText,
    error,
    inputProps = {},
    prefix='',
    suffix,
    classes,
    className,
    disabled,
    onChange,
    defaultValue,
    value,
    autoComplete,
    autoFocus,
    placeholder,
    required,
    type,
    fullWidth=true,
    ...restProps
  } = props;
  const applySuffixStringTypeStyle = typeof suffix === 'string';

  const suffixStyle = () => {
      if(applySuffixStringTypeStyle) {
          return {root: 'inputSuffix-string'}
      } 
      return {};
  }

  const InputPrefix = () => {
    if(prefix) {
        return <InputAdornment disableTypography={disabled} disablePointerEvents={disabled} position='start'>{prefix}</InputAdornment>
    } else {
        return null;
    }
  }
  const InputSuffix = () => {
      if(suffix) {
          return <InputAdornment disableTypography={disabled} disablePointerEvents={disabled} classes={suffixStyle()} position='end'>{suffix}</InputAdornment>
      } else {
          return null;
      }
  }
  return (
    <div>
      <TextField
        label={label}
        variant='filled'
        helperText={helperText}
        error={error}
        classes={classes}
        className={className}
        disabled={disabled}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        placeholder={placeholder}
        required={required}
        type={type}
        InputProps={{
          startAdornment: InputPrefix(),
          endAdornment: InputSuffix(),
          ...inputProps,
        }}
        {...restProps}
      />
    </div>
  );
};

export default InputField;
