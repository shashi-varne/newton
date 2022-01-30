import React from 'react';
import ConfirmAction from './ConfirmAction';

export default {
  component: ConfirmAction,
  title: 'Molecules/ConfirmAction',
};

export const Default = (args) => <ConfirmAction {...args} />;

Default.args = {
  title: 'item added to cart',
  titleColor: 'foundationColors.supporting.white',
  buttonTitle: 'Action',
  imgProps: {
    src: require('assets/amazon_pay.svg'),
  },
};
