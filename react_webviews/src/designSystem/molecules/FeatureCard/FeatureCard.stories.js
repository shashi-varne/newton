import React from 'react';
import FeatureCard from './FeatureCard';

export default {
  component: FeatureCard,
  title: 'Molecules/FeatureCard',
  argTypes: {
    topLeftImgProps: {
        control: {
            disable: true
        }
    },
  }
};

const Template = (args) => <FeatureCard {...args} />;

export const Tags = Template.bind({});

Tags.args = {
  topLeftImgSrc: require('assets/amazon_pay.svg'),
  heading: 'I am heading',
  headingColor: 'foundationColors.content.secondary',
  leftSlotProps: {
    tag: {
      label: 'Equity',
      labelColor: 'foundationColors.secondary.profitGreen.400',
      labelBackgroundColor: 'foundationColors.secondary.profitGreen.200',
    },
  },
  middleSlotProps: {
    tag: {
      label: 'Hybrid',
      labelColor: 'foundationColors.secondary.lossRed.400',
      labelBackgroundColor: 'foundationColors.secondary.lossRed.200',
    },
  },
  rightSlotProps: {
    tag: {
      label: 'Large',
      labelColor: 'foundationColors.secondary.coralOrange.400',
      labelBackgroundColor: 'foundationColors.secondary.coralOrange.200',
    },
  },
};

export const Description = Template.bind({});

Description.args = {
  topLeftImgSrc: require('assets/amazon_pay.svg'),
  heading: 'I am heading',
  headingColor: 'foundationColors.content.secondary',
  leftSlotProps: {
    description: {
      title: 'Title',
      titleColor: 'foundationColors.content.primary',
      subtitle: 'Subtitle',
      subtitleColor: 'foundationColors.content.secondary',
      leftImgSrc: require('assets/amazon_pay.svg')
    },
  },
  middleSlotProps: {
    description: {
      title: 'Title',
      titleColor: 'foundationColors.content.primary',
      subtitle: 'Subtitle',
      subtitleColor: 'foundationColors.content.secondary',
      leftImgSrc: require('assets/amazon_pay.svg')
    },
  },
  rightSlotProps: {
    description: {
      title: 'Title',
      titleColor: 'foundationColors.content.primary',
      subtitle: 'Subtitle',
      subtitleColor: 'foundationColors.content.secondary',
      leftImgSrc: require('assets/amazon_pay.svg')
    },
  },
};

export const Text = Template.bind({});

Text.args = {
  topLeftImgSrc: require('assets/amazon_pay.svg'),
  heading: 'I am heading',
  headingColor: 'foundationColors.content.secondary',
  leftSlotProps: {
    title: 'left title',
    titleColor: 'foundationColors.secondary.coralOrange.400',
  },
  middleSlotProps: {
    title: 'middle title',
    titleColor: 'foundationColors.secondary.blue.300',
  },
  rightSlotProps: {
    title: 'right title',
    titleColor: 'foundationColors.content.tertiary',
  },
};

export const Combination = Template.bind({});

Combination.args = {
  topLeftImgSrc: require('assets/amazon_pay.svg'),
  heading: 'I am heading',
  headingColor: 'foundationColors.content.secondary',
  leftSlotProps: {
    tag: {
      label: 'Equity',
    },
  },
  middleSlotProps: {
    description: {
      title: 'Title',
      subtitle: 'Subtitle',
    },
  },
  rightSlotProps: {
    title: 'right title',
  },
};
