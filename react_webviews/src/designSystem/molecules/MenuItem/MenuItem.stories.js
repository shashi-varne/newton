import React from 'react';
import MenuItem from './MenuItem';

export default {
  component: MenuItem,
  title: 'Molecules/MenuItem',
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
    subtitle: {
      control: {
        type: 'text',
      },
    },
    leftImgProps: {
        control:{
            disable: true
        }
    },
    rightImgProps: {
        control:{
            disable: true
        }
    }
  },
};

export const Default = (args) => <MenuItem {...args} />;

Default.args = {
  title: 'I am the title',
  titleColor: 'foundationColors.content.primary',
  subtitle: 'I am the subtitle',
  subtitleColor: 'foundationColors.content.secondary',
  leftImgSrc: require('assets/amazon_pay.svg'),
  rightImgSrc: require('assets/amazon_pay.svg'),
};
