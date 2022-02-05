import { FormControl, FormControlLabel, RadioGroup, Radio, Stack } from '@mui/material';
import React from 'react';
import RadioButton from '../../../designSystem/atoms/RadioButton';
import Typography from '../../../designSystem/atoms/Typography';

import './FundOptions.scss';

const FundOptions = () => {
  const [value, setValue] = React.useState('growth');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <div className='fund-options-wrapper'>
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue='female'
          name='radio-buttons-group'
          value={value}
          onChange={handleChange}
        >
          <Stack direction='column' spacing={2}>
            {FUND_OPTIONS?.map((option, idx) => {
              const selectedValue = option.value === value;
              const selectedColor = selectedValue
                ? 'foundationColors.primary.content'
                : 'foundationColors.content.secondary';
              return (
                <FormControlLabel
                  key={idx}
                  value={option.value}
                  control={<RadioButton isChecked={selectedValue} />}
                  label={
                    <Typography color={selectedColor} sx={{ ml: 2 }} variant='body2'>
                      {option.label}
                    </Typography>
                  }
                />
              );
            })}
          </Stack>
        </RadioGroup>
      </FormControl>
    </div>
  );
};

const FUND_OPTIONS = [
  {
    label: 'Growth',
    value: 'growth',
  },
  {
    label: 'Dividend',
    value: 'dividend',
  },
];

export default FundOptions;
