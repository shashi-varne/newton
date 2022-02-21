import { FormControl, FormControlLabel, RadioGroup, Radio, Stack } from '@mui/material';
import React from 'react';
import RadioButton from '../../../designSystem/atoms/RadioButton';
import Typography from '../../../designSystem/atoms/Typography';

import './FundOptions.scss';

const FundOptions = ({ fundOption, setFundOption }) => {
  const handleChange = (event) => {
    const value = event.target.value;
    setFundOption(value);

  };
  return (
    <div className='fund-options-wrapper'>
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue='female'
          name='radio-buttons-group'
          value={fundOption}
          onChange={handleChange}
        >
          <Stack direction='column' spacing={2}>
            {MINIMUM_INVESTMENT_OPTIONS?.map((option, idx) => {
              const selectedValue = option.value === fundOption;
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

const MINIMUM_INVESTMENT_OPTIONS = [
  {
    label: `Below ${formatAmountInr(500)}`,
    value: '500',
  },
  {
    label: 'Dividend',
    value: 'dividend',
  },
];

export default FundOptions;
