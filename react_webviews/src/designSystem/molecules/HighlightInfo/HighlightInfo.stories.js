import React from 'react';
import HighlightInfo from './HighlightInfo';

export default {
  component: HighlightInfo,
  title: 'Molecules/HighlightInfo',
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
    imgProps: {
      control: {
        disable: true,
      },
    },
  },
};

export const Default = (args) => <HighlightInfo {...args} />;

Default.args = {
  title: 'I am the title',
  titleColor: 'foundationColors.supporting.white',
  imgSrc: require('assets/amazon_pay.svg'),
};
