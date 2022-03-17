import React from 'react';

import CardHorizontal from './CardHorizontal';

export default {
  component: CardHorizontal,
  title: 'Molecules/CardHorizontal',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    variant: {
      control: { disable: true },
    },
    leftImgProps: {
      control: { disable: true },
    },
    rightImgProps: {
      control: { disable: true },
    },
    statusVariant: {
      options: ['POSITIVE', 'ATTENTION', 'WARNING'],
      control: 'radio',
    },
    footerText: {
      control: {
        type: 'text',
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
    description: {
      control: {
        type: 'text',
      },
    },
  },
};

const Template = (args) => <CardHorizontal {...args} />;

export const ProductVariant = Template.bind({});

ProductVariant.argTypes = {
  footerText: {
    control: {
      disable: true,
    },
  },
  footerTextColor: {
    control: {
      disable: true,
    },
  },
  footerBackground: {
    control: {
      disable: true,
    },
  },
};

ProductVariant.args = {
  leftImgSrc: require('assets/amazon_pay.svg'),
  title: 'I am the title',
  subtitle: 'I am the subtitle',
  description: 'I am the description',
  variant: 'product',
  titleColor: 'foundationColors.content.primary',
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  statusTitle: 'Success',
  actionLink: 'Action',
  footerText: '',
};

export const HeroCardVariant = Template.bind({});

HeroCardVariant.args = {
  title: 'I am the title',
  subtitle: 'I am the subtitle',
  description: 'I am the description',
  variant: 'heroCard',
  titleColor: 'foundationColors.content.primary',
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  statusTitle: 'Success',
  actionLink: 'Action',
  footerText: 'Information',
};
