import React from "react";
import CustomizedSlider from "./Slider";

export default {
  component: CustomizedSlider,
  title: "Atoms/CustomizedSlider",
};

export const SliderActive = (args) => <CustomizedSlider {...args} />;

SliderActive.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  getSliderValue: () => {},
};

export const SliderDisabled = (args) => <CustomizedSlider {...args} />;

SliderDisabled.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: true,
  getSliderValue: () => {},
};
