import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Pill, Pills } from './Pills';

export default {
  component: Pills,
  title: 'Atoms/Pills',
  argTypes: {
    numberOfPillOnlyForStories: { type: 'number', defaultValue: 4 },
    customWidthForStories: { type: 'number', defaultValue: 343 },
  },
};

export const Default = ({ numberOfPillOnlyForStories, customWidthForStories, ...args }) => {
  const [value, setValue] = useState(0);
  const handleTabs = (e, val) => {
    setValue(val);
  };
  return (
    <Box sx={{width: `${customWidthForStories}px`}} >
      <Pills {...args} value={value} onChange={handleTabs}>
        {[...Array(numberOfPillOnlyForStories).keys()].map((el, idx) => {
          return <Pill label={`Label ${idx + 1}`} />;
        })}
      </Pills>
    </Box>
  );
};
