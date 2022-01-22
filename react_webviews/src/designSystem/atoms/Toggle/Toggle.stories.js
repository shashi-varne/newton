import React, { useState } from 'react';
import Toggle from './Toggle';

export default {
  component: Toggle,
  title: 'Atoms/Toggle',
  argTypes: {
    disabled: {
      defaultValue: false,
    },
  },
};

export const Default = (args) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  return <Toggle {...args} checked={checked} onChange={handleToggle}/>;
};
