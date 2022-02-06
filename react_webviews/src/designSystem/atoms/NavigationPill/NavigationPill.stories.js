import React from 'react';
import NavigationPill from './NavigationPill';

export default {
  component: NavigationPill,
  title: 'Atoms/NavigationPill',
  argTypes: {
    label: {
      defaultValue: 'Navigation Pill',
      control: {
        type: 'text',
      },
    },
    disabled: {
      defaultValue: false,
    },
  },
};

export const Default = (args) => <NavigationPill {...args} />;
