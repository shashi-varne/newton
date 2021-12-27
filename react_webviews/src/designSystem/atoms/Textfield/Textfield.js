import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import './Textfield.scss';

const Textfield = ({ value, wordLimit, onChange, ...props }) => {
    const isValidWordLimit = useMemo(() => typeof wordLimit === 'number',[wordLimit]);
    if(wordLimit && !isValidWordLimit) {
        console.warn(`passed propType for wordlimit: ${typeof wordLimit}\n expected propType: number`);
    }
  const handleChange = (event) => {
    const textValue = event.target.value;
    if (wordLimit && textValue.length > wordLimit) {
      return;
    }
    onChange(event);
  };
  return (
    <TextField
      multiline
      value={value}
      helperText={wordLimit && isValidWordLimit ? `${wordLimit - value?.length}` : ''}
      onChange={handleChange}
      FormHelperTextProps={{
        classes: { root: 'custom-textfield-helper-text' },
      }}
      {...props}
    />
  );
};

export default Textfield;