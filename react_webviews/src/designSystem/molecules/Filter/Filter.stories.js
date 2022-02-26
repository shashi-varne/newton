import React from "react";
import Filter from "./Filter";

export default {
  component: Filter,
  title: "Molecules/Filter",
  argTypes: {
    imgSrc: {
      defaultValue: require(`assets/cub.png`),
    },
    filterCount: {
      defaultValue: 1,
    },
    title: {
      defaultValue: "label",
    },
    dataAid: {
      defaultValue: "sort",
    },
    onClick: {
      action: "filter-clicked",
    },
  },
};

export const Default = (args) => <Filter {...args} />;
