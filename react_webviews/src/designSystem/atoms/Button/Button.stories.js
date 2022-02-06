import React from 'react';
import Button from './Button';

export default {
  component: Button,
  title: 'Atoms/Button',
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: 'radio',
    },
    variant: {
      options: ['primary', 'secondary', 'link'],
      control: 'radio',
    },
    isLoading: {
      defaultValue: false,
    },
    disabled: {
      defaultValue: false,
    },
    isInverted: {
      defaultValue: false,
    },
  },
};

const Template = (args) => (
  <div style={{width: '343px'}}>
    <Button {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  title: 'Continue',
};
