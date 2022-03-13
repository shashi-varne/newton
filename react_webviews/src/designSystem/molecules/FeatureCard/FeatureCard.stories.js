import React from 'react';
import FeatureCard, { LeftSlot, MiddleSlot, RightSlot } from './FeatureCard';

export default {
  component: FeatureCard,
  title: 'Molecules/FeatureCard',
  argTypes: {
    topLeftImgProps: {
      control: {
        disable: true,
      },
    },
  },
};

const Template = (args) => <FeatureCard {...args} />;

export const Tags = (args) => {
  return (
    <FeatureCard
      {...args}
      topLeftImgSrc={require('assets/amazon_pay.svg')}
      heading='I am heading'
    >
      <LeftSlot
        tag={{
          label: 'Equity',
          labelColor: 'foundationColors.secondary.profitGreen.400',
          labelBackgroundColor: 'foundationColors.secondary.profitGreen.200',
        }}
      />

      <MiddleSlot
        tag={{
          label: 'Hybrid',
          labelColor: 'foundationColors.secondary.lossRed.400',
          labelBackgroundColor: 'foundationColors.secondary.lossRed.200',
        }}
      />
      <RightSlot
        tag={{
          label: 'Large',
          labelColor: 'foundationColors.secondary.coralOrange.400',
          labelBackgroundColor: 'foundationColors.secondary.coralOrange.200',
        }}
      />
    </FeatureCard>
  );
};

export const Description = (args) => {
  return (
    <FeatureCard
      {...args}
      topLeftImgSrc={require('assets/amazon_pay.svg')}
      heading='I am heading'
    >
      <LeftSlot
        description={{
          title: 'Title',
          titleColor: 'foundationColors.content.primary',
          subtitle: 'Subtitle',
          subtitleColor: 'foundationColors.content.secondary',
          leftImgSrc: require('assets/amazon_pay.svg'),
        }}
      />

      <MiddleSlot
        description={{
          title: 'Title',
          titleColor: 'foundationColors.content.primary',
          subtitle: 'Subtitle',
          subtitleColor: 'foundationColors.content.secondary',
          leftImgSrc: require('assets/amazon_pay.svg'),
        }}
      />
      <RightSlot
        description={{
          title: 'Title',
          titleColor: 'foundationColors.content.primary',
          subtitle: 'Subtitle',
          subtitleColor: 'foundationColors.content.secondary',
          leftImgSrc: require('assets/amazon_pay.svg'),
        }}
      />
    </FeatureCard>
  );
};

export const Text = (args) => {
  return (
    <FeatureCard
      {...args}
      topLeftImgSrc={require('assets/amazon_pay.svg')}
      heading='I am heading'
    >
      <LeftSlot title='left title' titleColor='foundationColors.secondary.coralOrange.400' />
      <MiddleSlot title='middle title' titleColor='foundationColors.secondary.blue.300' />
      <RightSlot title='right title' titleColor='foundationColors.content.tertiary' />
    </FeatureCard>
  );
};

export const Combination = (args) => {
  return (
    <FeatureCard
      {...args}
      topLeftImgSrc={require('assets/amazon_pay.svg')}
      heading='I am heading'
    >
      <LeftSlot
        tag={{
          label: 'Equity',
        }}
      />

      <MiddleSlot
        description={{
          title: 'Title',
          subtitle: 'Subtitle',
        }}
      />
      <RightSlot title='right title' />
    </FeatureCard>
  );
};
