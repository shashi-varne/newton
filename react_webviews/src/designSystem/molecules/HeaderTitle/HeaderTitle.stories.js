import React from 'react';
import Typography from '../../atoms/Typography';
import HeaderTitle from './HeaderTitle';

export default {
  component: HeaderTitle,
  title: 'Molecules/HeaderTitle',
  argTypes: {
    withImage: {
      defaultValue: true,
    },
  },
};

const Template = ({withImage, ...args}) => {
    if(!withImage) {
        args.imgProps = {}
        // args.imgProps?.src = require('assets/amazon_pay.svg');
    }
  return (
    <HeaderTitle {...args}>
      <HeaderTitle.Title>{args?.title}</HeaderTitle.Title>
      <HeaderTitle.Subtitle>{args?.subtitle}</HeaderTitle.Subtitle>
      <HeaderTitle.SubtitleLabels>
        <Typography>Equity</Typography>
        <Typography>Hybrid</Typography>
      </HeaderTitle.SubtitleLabels>
    </HeaderTitle>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'I am heading',
  subtitle: 'I am subtitle',
  imgProps: {
      src: require('assets/amazon_pay.svg')
  }
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
