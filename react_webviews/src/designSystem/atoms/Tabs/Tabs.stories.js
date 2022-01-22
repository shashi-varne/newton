import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Tab, Tabs } from './Tabs';

export default {
  component: Tabs,
  title: 'Atoms/Tabs',
  argTypes: {
    numberOfTabOnlyForStories: { type: 'number', defaultValue: 4 },
    containerWidth: { type: 'number', defaultValue: 343 },
  },
};

export const Default = ({ numberOfTabOnlyForStories, containerWidth, ...args }) => {
  const [value, setValue] = useState(0);
  const handleTabs = (e, val) => {
    setValue(val);
  };
  return (
    <Box sx={{ width: `${containerWidth}px` }}>
      <Tabs {...args} value={value} onChange={handleTabs}>
        {[...Array(numberOfTabOnlyForStories).keys()].map((el, idx) => {
          return <Tab label={`Label ${idx + 1}`} />;
        })}
      </Tabs>
    </Box>
  );
};
