import { FormControl, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import React from 'react';
import RadioButton from '../../../designSystem/atoms/RadioButton';
import Typography from '../../../designSystem/atoms/Typography';
import { FUND_OPTIONS } from "businesslogic/constants/diy";

import './FundOptions.scss';

const FundOptions = ({ fundOption, setFundOption }) => {
  const handleChange = (event) => {
    const value = event.target.value;
    setFundOption(value);

  };
  return (
    <div className='fund-options-wrapper' data-aid="grp_fundOptions" >
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue='female'
          name='radio-buttons-group'
          value={fundOption}
          onChange={handleChange}
        >
          <Stack direction='column' spacing={2}>
            {FUND_OPTIONS?.map((option, idx) => {
              const selectedValue = option.value === fundOption;
              const selectedColor = selectedValue
                ? 'foundationColors.primary.content'
                : 'foundationColors.content.secondary';
              return (
                <FormControlLabel
                  key={idx}
                  value={option.value}
                  control={<RadioButton isChecked={selectedValue} dataAid={idx+1} />}
                  label={
                    <Typography color={selectedColor} sx={{ ml: 2 }} variant='body2' dataAid={`list${idx+1}`} >
                      {option.label}
                    </Typography>
                  }
                  data-aid={`grp_${idx+1}`}
                />
              );
            })}
          </Stack>
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default FundOptions;
