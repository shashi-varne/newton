import React from 'react';
import Tag from './Tag';

export default {
  component: Tag,
  title: 'Molecules/Tag',
  argTypes: {
    morningStarVariant: {
      options: ['small', 'large'],
      control: 'radio',
    },
  },
};

const Template = (args) => <Tag {...args} />;

export const MorningStar = Template.bind({});
MorningStar.args = {
  morningStarVariant: 'small',
  label: 3.7,
};
MorningStar.argTypes = {
  labelBackgroundColor: {
    control: { disable: true },
  },
};

export const Label = Template.bind({});
Label.args = {
  morningStarVariant: '',
  label: 'Equity',
};
Label.argTypes = {
  morningStarVariant: {
    control: { disable: true },
  },
};

export const LabelWithIcon = Template.bind({});
LabelWithIcon.args = {
  label: 'Label',
  leftImgProps: {
    src: require('assets/amazon_pay.svg'),
  },
};
LabelWithIcon.argTypes = {
  morningStarVariant: {
    control: { disable: true },
  },
  labelBackgroundColor: {
    control: { disable: true },
  },
};
