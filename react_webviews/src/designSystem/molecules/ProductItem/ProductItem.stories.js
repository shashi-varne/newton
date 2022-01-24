import React from 'react';
import ProductItem from './ProductItem';

export default {
  component: ProductItem,
  title: 'Molecules/ProductItem',
};

const Template = (args) => <ProductItem {...args} />;

export const WithDescription = Template.bind({});

WithDescription.args = {
  leftImgSrc: require('assets/amazon_pay.svg'),
  headerTitle: 'I am the header',
  headerTitleColor: 'foundationColors.content.primary',
  bottomSectionData: {
    tagOne: {
      label: 'Equity',
    },
    tagTwo: {
      label: 'Equity',
    },
  },
  rightSectionData: {
    description: {
      title: 'Title',
      titleColor: 'foundationColors.content.primary',
      subtitle: 'Subtitle',
      subtitleColor: 'foundationColors.content.tertiary',
    },
  },
};

export const WithCta = Template.bind({});

WithCta.args = {
  leftImgSrc: require('assets/amazon_pay.svg'),
  headerTitle: 'I am the header',
  headerTitleColor: 'foundationColors.content.primary',
  bottomSectionData: {
    tagOne: {
      label: 'Equity',
    },
    titleOne: 'I am text',
    titleOneColor: 'foundationColors.content.tertiary',
  },
  rightSectionData: {
    btnProps: {
        title: 'Cta',
    }
  },
};
