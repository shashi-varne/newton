import React from 'react';
import CheckoutCard from './CheckoutCard';

export default {
  component: CheckoutCard,
  title: 'Molecules/CheckoutCard',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    variant: {
      control: {
        disable: true,
      },
    },
    sx: {
      control: {
        disable: true,
      },
    },
    leftImgProps: {
      control: {
        disable: true,
      },
    },

    rightImgProps: {
      control: {
        disable: true,
      },
    },
  },
};

const Template = (args) => <CheckoutCard {...args} />;

export const SingleItem = Template.bind({});

SingleItem.args = {
  variant: 'single',
  title: 'I am the Title',
  titleColor: 'foundationColors.conten.primary',
  leftImgSrc: require('assets/amazon_pay.svg'),
  bottomSectionData: [
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
  ],
  footerSectionData: {
    leftTitle: 'left title',
    rightTitle: 'right title',
  },
};

export const MultiItem = Template.bind({});
MultiItem.args = {
  variant: 'multiple',
  title: 'I am the Title',
  titleColor: 'foundationColors.conten.primary',
  rightImgSrc: require('assets/amazon_pay.svg'),
  topSectionData: [
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
  ],
  bottomSectionData: [
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
    {
      leftTitle: 'left title',
      rightTitle: 'right title',
    },
  ],
  footerSectionData: {
    leftTitle: 'left hello',
    rightTitle: 'right title',
  },
  handleIconClick: null,
};
