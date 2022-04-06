import React from 'react';
import EstimationCard from './EstimationCard';

export default {
  component: EstimationCard,
  title: 'Molecules/EstimationCard',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    leftTitle: {
      control: {
        type: 'text',
      },
    },
    rightTitle: {
      control: {
        type: 'text',
      },
    },
    leftSubtitle: {
      control: {
        type: 'text',
      },
    },
    rightSubtitle: {
      control: {
        type: 'text',
      },
    },
  },
};

const Template = (args) => <EstimationCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  leftTitle: 'Left Title',
  leftSubtitle: 'Left Subtitle',
  rightTitle: 'Right Title',
  rightSubtitle: 'Right Subtitle',
  leftTitleColor: 'foundationColors.primary.content',
  rightTitleColor: 'foundationColors.primary.content',
  leftSubtitleColor: 'foundationColors.content.secondary',
  rightSubtitleColor: 'foundationColors.content.secondary',
  iconSrc: require('assets/amazon_pay.svg'),
  onClick: null,
  onIconClick: () => {console.log("hello")}
};

export const WithTooltip = (args) => {
  return <EstimationCard {...args} />;
};

WithTooltip.args = {
  leftTitle: 'Left Title',
  leftSubtitle: 'Left Subtitle',
  rightTitle: 'Right Title',
  rightSubtitle: 'Right Subtitle',
  toolTipText: 'I am a tooltip',
  leftTitleColor: 'foundationColors.primary.content',
  rightTitleColor: 'foundationColors.primary.content',
  leftSubtitleColor: 'foundationColors.content.secondary',
  rightSubtitleColor: 'foundationColors.content.secondary',
  onClick: null,
};
