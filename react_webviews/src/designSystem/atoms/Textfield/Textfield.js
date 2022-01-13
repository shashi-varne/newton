import React from 'react';
import { TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './Textfield.scss';

const Textfield = ({ value, wordLimit, onChange, helperText, error, ...props }) => {
  const showWordLimitError = wordLimit && wordLimit - value?.length === 0;
  const handleChange = (event) => {
    const textValue = event.target.value;
    if (wordLimit && textValue.length > wordLimit) {
      return;
    }
    onChange(event);
  };
  return (
    <TextField
      value={value}
      fullWidth
      helperText={
        <HelperText helperText={helperText} error={showWordLimitError || error} wordLimit={wordLimit} value={value} />
      }
      onChange={handleChange}
      FormHelperTextProps={{
        classes: { root: 'custom-textfield-helper-text' },
        component: 'div',
      }}
      {...props}
    />
  );
};

export default Textfield;

TextField.propTypes = {
  wordLimit: PropTypes.number,
  error: PropTypes.bool,
  onChange: PropTypes.func,
};

const HelperText = ({ helperText, error, wordLimit, value }) => {
  const color = error ? 'foundationColors.secondary.lossRed.400' : 'foundationColors.content.secondary';
  return (
    <div className='custom-helper-text-wrapper'>
      <Typography align='left' variant='body5' color={color}>
        {helperText}
      </Typography>
      {wordLimit && (
        <Typography variant='body5' align='right' color='foundationColors.content.secondary'>
          {wordLimit - value?.length}
        </Typography>
      )}
    </div>
  );
};
