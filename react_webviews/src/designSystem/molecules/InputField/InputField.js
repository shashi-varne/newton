import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import './InputField.scss';

const InputField = (props) => {
  const {
    label,
    helperText,
    error,
    inputProps = {},
    inputPrefix='',
    inputSuffix,
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
  const applySuffixStringTypeStyle = typeof inputSuffix === 'string';
  const suffixStyle = () => {
      if(applySuffixStringTypeStyle) {
          return {root: 'inputSuffix-string'}
      } 
      return {};
  }

  const InputPrefix = () => {
    if(inputPrefix) {
        return <InputAdornment disableTypography={disabled} disablePointerEvents={disabled} position='start'>{inputPrefix}</InputAdornment>
    } else {
        return null;
    }
  }
  const InputSuffix = () => {
      if(inputSuffix) {
          return <InputAdornment disableTypography={disabled} disablePointerEvents={disabled} classes={suffixStyle()} position='end'>{inputSuffix}</InputAdornment>
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
