import React from 'react';
import TextField from 'material-ui/TextField';

const Input = (props) => {
  if (props.type === 'date' || props.shrink) {
    return (
      <TextField
        error={props.error}
        type={props.type}
        defaultValue={props.default}
        value={props.value}
        helperText={props.helperText}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth={props.fullWidth}
        required={props.required}
        className={props.class}
        id={props.id}
        label={props.label}
        onFocus={props.onFocus}
        name={props.name}
        onChange={props.onChange} />
    );
  } else {
    return (
      <TextField
        error={props.error}
        disabled={props.disabled}
        type={props.type}
        defaultValue={props.default}
        value={props.value}
        helperText={props.helperText}
        fullWidth={props.fullWidth}
        required={props.required}
        className={props.class}
        id={props.id}
        label={props.label}
        onFocus={props.onFocus}
        name={props.name}
        onChange={props.onChange} />
    );
  }
};

export default Input;
