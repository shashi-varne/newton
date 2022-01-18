import React from 'react';
import InputField from './InputField';

export default {
  component: InputField,
  title: 'Molecules/InputField',
  argTypes: {
    disabled: {
      defaultValue: false,
    },
    error: {
      defaultValue: false,
    },
    variant: {
      options: ['filled', 'outlined'],
      control: { type: 'radio' },
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'radio' },
    },
  },
};

const Template = (args) => <InputField {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Label',
  placeholder: '',
  variant: 'filled',
  helperText: '',
  prefix: '',
  suffix: '',
};
