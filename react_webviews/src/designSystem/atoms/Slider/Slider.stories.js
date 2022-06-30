import React from "react";
import Slider from "./Slider";

export default {
  component: Slider,
  title: "Atoms/Slider",
};

export const SliderActive = (args) => <Slider {...args} />;

SliderActive.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  getSliderValue: () => {},
};

export const SliderDisabled = (args) => <Slider {...args} />;

SliderDisabled.args = {
  min: 0,
  max: 100,
  step: 1,
  sliderValue: true,
  onChange: () => {},
};
