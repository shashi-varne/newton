import React from 'react';
import Content from './Content';

export default {
  component: Content,
  title: 'Molecules/Content',
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
    imgProps: {
      control: {
        disable: true,
      },
    },
  },
};

export const Default = (args) => <Content {...args} />;

Default.args = {
  imgSrc: require('assets/amazon_pay.svg'),
  title: 'I am the title',
  titleColor: 'foundationColors.content.primary',
  subtitle: 'I am the subtitle',
  subtitleColor: 'foundationColors.content.secondary',
};
