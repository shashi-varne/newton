import { Box } from '@mui/material';
import React from 'react';
import { Pill, Pills } from './Pills';

export default {
  component: Pills,
  title: 'Molecules/Pills',
  argTypes: {
    value: {type: 'number', defaultValue: 0},
    numberOfPillOnlyForStories: { type: 'number', defaultValue: 4 },
    customWidthForStories: { type: 'number', defaultValue: 343 },
  },
};

export const Default = ({ numberOfPillOnlyForStories, value, customWidthForStories, ...args }) => {
  return (
    <Box sx={{width: `${customWidthForStories}px`}} >
      <Pills {...args} value={value}>
        {[...Array(numberOfPillOnlyForStories).keys()].map((el, idx) => {
          return <Pill label={`Label ${idx + 1}`} />;
        })}
      </Pills>
    </Box>
  );
};
