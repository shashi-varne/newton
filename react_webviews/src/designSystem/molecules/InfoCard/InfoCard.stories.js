import React from 'react';
import InfoCard from './InfoCard';

export default {
  component: InfoCard,
  title: 'Molecules/InfoCard',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
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
  },
};

export const Default = (args) => <InfoCard {...args} />;

Default.args = {
  imgSrc: require('assets/amazon_pay.svg'),
  title: 'I am the title',
  subtitle: 'I am the subtitle',
  titleColor: 'foundationColors.content.primary',
  subtitleColor: 'foundationColors.content.secondary',
};
