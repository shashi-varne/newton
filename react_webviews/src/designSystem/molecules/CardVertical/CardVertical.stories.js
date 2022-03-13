import React from 'react';
import CardVertical from './CardVertical';

export default {
  component: CardVertical,
  title: 'Molecules/CardVertical',
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
    description: {
      control: {
        type: 'text',
      },
    },
  },
};

export const Default = (args) => <CardVertical {...args} />;

Default.args = {
  imgSrc: require('assets/amazon_pay.svg'),
  title: 'Title',
  subtitle: 'Subtitle',
  description: 'Description',
  titleColor: 'foundationColors.content.primary',
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
};
