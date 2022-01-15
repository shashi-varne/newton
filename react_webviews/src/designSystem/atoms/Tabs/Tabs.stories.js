import { Box } from '@mui/material';
import React from 'react';
import { Tab, Tabs } from './Tabs';

export default {
  component: Tabs,
  title: 'Molecules/Tabs',
  argTypes: {
    value: {type: 'number', defaultValue: 0},
    numberOfTabOnlyForStories: { type: 'number', defaultValue: 4 },
    width: { type: 'number', defaultValue: 343 },
  },
};

export const Default = ({ numberOfTabOnlyForStories, width,value, ...args }) => {
  return (
    <Box sx={{width: `${width}px`}}>
      <Tabs {...args} value={value}>
        {[...Array(numberOfTabOnlyForStories).keys()].map((el, idx) => {
          return <Tab label={`Label ${idx + 1}`} />;
        })}
      </Tabs>
    </Box>
  );
};
