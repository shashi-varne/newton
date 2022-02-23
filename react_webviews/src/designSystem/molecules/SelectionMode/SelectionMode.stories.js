import React, { useState } from 'react';
import SelectionMode from './SelectionMode';

export default {
  component: SelectionMode,
  title: 'Molecules/SelectionMode',
  argTypes: {
    variant: {
      control: {
        disable: true,
      },
    },
  },
};

const Template = (args) => <SelectionMode {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'I am the title',
  titleColor: 'foundationColors.content.primary',
  leftImgSrc: require('assets/amazon_pay.svg'),
  rightImgSrc: require('assets/amazon_pay.svg'),
};

export const RadioVariant = (args) => {
  const [value, setValue] = useState(0);
  const handleRadioOptions = (e) => {
    setValue(Number(e.target.value));
  };

  return <SelectionMode {...args} selectedValue={value} handleChange={handleRadioOptions} />;
};

RadioVariant.args = {
  variant: 'radio',
  options: [
    {
      title: 'I am the title',
      titleColor: 'foundationColors.content.primary',
      leftImgSrc: require('assets/amazon_pay.svg'),
      rightImgSrc: require('assets/amazon_pay.svg'),
      value: 0,
    },
    {
      title: 'I am the title',
      titleColor: 'foundationColors.content.primary',
      leftImgSrc: require('assets/amazon_pay.svg'),
      rightImgSrc: require('assets/amazon_pay.svg'),
      value: 1,
    },
    {
      title: 'I am the title',
      titleColor: 'foundationColors.content.primary',
      rightImgSrc: require('assets/amazon_pay.svg'),
      leftImgSrc: require('assets/amazon_pay.svg'),
      value: 2,
    },
  ],
};
