import React from 'react';
import HeaderTitle from './HeaderTitle';

export default {
  component: HeaderTitle,
  title: 'Molecules/HeaderTitle',
  argTypes: {
    imgProps: {
      control: {
        disable: true,
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

const Template = (args) => <HeaderTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'I am heading',
  subtitle: 'I am subtitle',
  imgSrc: require('assets/amazon_pay.svg'),
  subTitleLabels: [
    {
      name: 'Equity',
      color: 'foundationColors.secondary.profitGreen.300',
    },
    {
      name: 'Hybrid',
      color: 'foundationColors.secondary.lossRed.300',
    },
    {
      name: 'Debt',
    },
  ],
};

Default.argTypes = {
  imgProps: {
    control: { disable: true },
  },
  children: {
    control: { disable: true },
  },
};

export const WithSubtitleLabels = Template.bind({});
WithSubtitleLabels.args = {
  title: 'I am heading',
  subtitle: 'I am subtitle',
};

WithSubtitleLabels.argTypes = {
  imgProps: {
    control: { disable: true },
  },
  children: {
    control: { disable: true },
  },
  subTitleLabels: {
    control: { disable: true },
  },
};
