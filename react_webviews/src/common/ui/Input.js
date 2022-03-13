import React, { useMemo } from 'react';
import TextField from 'material-ui/TextField';
import './style.scss';

import { getDataAid } from '../../utils/validators';

import { camelCase } from 'lodash';


const Input = (props) => {
  const onKeyDownCapture = (event) => {
    const code = event.keyCode;
    if (code === 13) {
      // eslint-disable-next-line no-unused-expressions
      props.onEnterPressed?.(event);
    }
  }
  
  const onKeyDown = useMemo(() => {
    return props.onKeyDown || onKeyDownCapture;
  }, [props.onKeyDown]);

  if (props.type === 'date' || props.shrink) {
    return (
      <TextField
        error={props.error}
        type={props.type}
        value={props.value}
        helperText={props.helperText}
        InputLabelProps={{
          shrink: true,
          'data-aid': getDataAid('tv', 'label')
        }}
        inputProps={{
          max: `${props.max}`,
          'data-aid': getDataAid('et', 'text')
        }}
        fullWidth
        required={props.required}
        className={props.class}
        id={props.id}
        label={props.label}
        onFocus={props.onFocus}
        name={props.name}
        variant={props.variant}
        onChange={props.onChange}
        inputRef={props.inputRef}
        onKeyDown={props.onKeyDown}
        data-aid={getDataAid('inputField', props?.dataAid || 'dob')}
      />
    );
  } else {
    return (
      <TextField
        inputRef={props.inputRef}
        error={props.error}
        rows={props.rows}
        disabled={props.disabled}
        type={props.type}
        defaultValue={props.defaultValue}
        value={props.value}
        helperText={props.helperText}
        placeholder={props.placeholder}
        required={props.required}
        className={props.class}
        id={props.id}
        label={props.label}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        name={props.name}
        onChange={props.onChange}
        variant={props.variant}
        onKeyPress={props.onKeyChange}
        inputProps={{
          maxLength: props.maxLength,
          inputMode: props.inputMode,
          pattern:props.pattern,
          'data-aid': getDataAid('et', 'text')
        }}
        InputLabelProps={{
          shrink: true,
          'data-aid': getDataAid('tv', 'label')
        }}
        onClick={props.onClick}
        autoComplete={props.autoComplete}
        autoFocus={props.autoFocus}
        multiline={props.multiline}
        onKeyDown={onKeyDown}
        onKeyUp={props.onKeyUp}
        rowsMax="3"
        data-aid={getDataAid('inputField', props?.dataAidSuffix || (props?.dataAid || camelCase(props?.label.replace(`'s`, ''))))}
      />
    );
  }
};

export default Input;
