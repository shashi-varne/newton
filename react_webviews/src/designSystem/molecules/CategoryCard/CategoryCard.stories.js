import React from 'react';
import CategoryCard from './CategoryCard';

export default {
  component: CategoryCard,
  title: 'Molecules/CategoryCard',
  argTypes: {
    variant: {
      options: ['large', 'small'],
      control: {
        type: 'radio',
      },
    },
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

export const Default = (args) => <CategoryCard {...args} />;

Default.args = {
  title: 'I am the Title',
  subtitle: 'I am the subtitle',
  imgSrc: require('assets/amazon_pay.svg')
};
