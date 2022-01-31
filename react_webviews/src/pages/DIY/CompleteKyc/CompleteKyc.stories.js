import React from 'react';
import CompleteKyc from './CompleteKyc';

export default {
  component: CompleteKyc,
  title: 'Pages/DIY/CompleteKyc',
  parameters: {
      layout: 'fullscreen'
  }
};

export const Default = (args) => <CompleteKyc {...args} />;

Default.args = {
    onCtaClick: () => {console.log("button is clicked")}
}
