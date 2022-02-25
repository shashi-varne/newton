import React from 'react';
import SubCategoryFunds from './SubCategoryFunds';
import { getConfig } from '../../../utils/functions';

const {productName} = getConfig();
export default {
  component: SubCategoryFunds,
  title: 'Pages/Diy/SubCategoryFunds',
  parameters: {
    layout: 'fullScreen',
  },
};

export const Default = (args) => <SubCategoryFunds {...args} />;

const FUND_CATEGORY_LISTS = [
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'Technology funds',
  },
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'Healthcare funds',
  },
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'Consumption funds',
  },
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'ESG',
  },
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'Infrastructure',
  },
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'Financial services',
  },
  {
    imgSrc: require(`assets/${productName}/technology_funds.svg`),
    title: 'Financial services',
  },
];

Default.args = {
  headerTitle: 'Sector and themes',
  fundCategoryList: FUND_CATEGORY_LISTS,
  cartCount: 12,
  onCartClick: () => {
    console.log('cart is clicked');
  },
  onCardClick: (item) => {
    console.log('cart item is', item);
  },
  CCvariant: 'large'
};
