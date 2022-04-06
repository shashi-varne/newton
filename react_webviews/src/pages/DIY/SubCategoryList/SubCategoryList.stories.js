import React from "react";
import SubCategoryList from "./SubCategoryList";
import largeCap from 'assets/large_cap.svg';


export default {
    component: SubCategoryList,
    title: 'Pages/Diy/SubCategoryList',
    parameters: {
        layout: 'fullScreen'
    }
}

export const Default = args => <SubCategoryList {...args}/>


const CATEGORY_LISTS = [
    {
      imgSrc: largeCap,
      title: 'Large cap',
      description: 'Long term capital growth',
    },
    {
      imgSrc: largeCap,
      title: 'Multi cap',
      description: 'Long term capital growth',
    },
    {
      imgSrc: largeCap,
      title: 'Large cap',
      description: 'Long term capital',
    },
    {
      imgSrc: largeCap,
      title: 'Large & mid cap',
      description: 'Long term capital growth',
    },
    {
      imgSrc: largeCap,
      title: 'Large cap',
      description: 'Long term capital growth',
    },
    {
      imgSrc: largeCap,
      title: 'Large cap',
      description: 'Long term capital growth',
    },
    {
      imgSrc: largeCap,
      title: 'Large cap',
      description: 'Long term capital growth',
    },
  ];
Default.args = {
    headerTitle: 'Market cap',
    categoryList: CATEGORY_LISTS,
    cartCount: 12,
    onCartClick: () => {console.log("cart is clicked")},
    onCardClick: (item) => {console.log("cart item is",item)}
}