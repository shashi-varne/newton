import React from 'react';
import TextField from 'material-ui/TextField';

const Input = (props) => {
  if (props.type === 'date') {
    return (
      <TextField
        type={props.type}
        defaultValue={props.default}
        helperText={props.helperText}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth={props.fullWidth}
        required={props.required}
        className={props.class}
        id={props.id}
        label={props.label} />
    );
  } else {
    return (
      <TextField
        type={props.type}
        defaultValue={props.default}
        helperText={props.helperText}
        fullWidth={props.fullWidth}
        required={props.required}
        className={props.class}
        id={props.id}
        label={props.label} />
    );
  }
};

export default Input;
