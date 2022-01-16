import React from 'react';
import Toggle from './Toggle';

export default {
  component: Toggle,
  title: 'Atoms/Toggle',
  argTypes: {
    checked: {
      defaultValue: true,
    },
    disabled: {
      defaultValue: false,
    },
    onChange: {
      action: 'toggle-clicked',
    },
  },
};

export const Default = (args) => <Toggle {...args} />;
