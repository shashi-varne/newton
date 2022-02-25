import { Box } from '@mui/material';
import React, { useState } from 'react';
import { TimeLine, Timelines } from './Timelines';

export default {
  component: Timelines,
  title: 'Atoms/Timelines',
  argTypes: {
    numberOfTimelineOnlyForStories: { type: 'number', defaultValue: 4 },
    customWidthForStories: { type: 'number', defaultValue: 343 },
  },
};

export const Default = ({ numberOfTimelineOnlyForStories, customWidthForStories, ...args }) => {
  const [value, setValue] = useState(0);
  const handleTabs = (e, val) => {
    setValue(val);
  };
  return (
    <Box sx={{ width: `${customWidthForStories}px` }}>
      <Timelines {...args} value={value} onChange={handleTabs}>
        {[...Array(numberOfTimelineOnlyForStories).keys()].map((el, idx) => {
          return <TimeLine label={`${idx + 1}`} />;
        })}
      </Timelines>
    </Box>
  );
};
