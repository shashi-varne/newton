import React from 'react';
import ConfirmAction from './ConfirmAction';

export default {
  component: ConfirmAction,
  title: 'Molecules/ConfirmAction',
  argTypes: {
    badgeVariant: {
      options: ['dot', 'standard'],
      control: {
        type: 'radio',
      },
    },
  },
};

export const Default = (args) => <ConfirmAction {...args} />;

Default.args = {
  title: 'item added to cart',
  titleColor: 'foundationColors.supporting.white',
  buttonTitle: 'Action',
  imgSrc: require('assets/amazon_pay.svg'),
  badgeContent: 10,
};

Default.argTypes = {
  imgProps: {
    control: {
      disable: true,
    },
  },
  className: {
    control: {
      disable: true,
    },
  },
};
