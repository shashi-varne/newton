import React from "react";
import Box from "@mui/material/Box";
import Slider, { SliderThumb } from "@mui/material/Slider";
import "./Slider.scss";
import PropTypes from "prop-types";

const disabledImg = require("assets/disabled_slider_base.svg");
const activeImg = require("assets/slider_base.svg");
const sliderArrow = require("assets/slider_arrow.svg");

const CustomThumb = (props) => {
  const { children, ...other } = props;
  const disabled = props?.children?.props?.disabled;
  const sliderBaseUrl = disabled ? disabledImg : activeImg;

  return (
    <SliderThumb {...other}>
      {children}
      <div className="slider-base">
        <img src={sliderBaseUrl} style={{ width: 42, height: 42 }} />
        <img src={sliderArrow} className="slider-arrow" />
      </div>
    </SliderThumb>
  );
};

export default function CustomizedSlider({
  min,
  max,
  step,
  onChange,
  disabled,
  sliderValue,
}) {
  return (
    <Box className="customized-slider">
      <Slider
        components={{ Thumb: CustomThumb }}
        min={min}
        max={max}
        onChange={(e, val) => onChange(e, val)}
        step={step}
        value={sliderValue}
        disabled={disabled}
      />
    </Box>
  );
}

CustomizedSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  sliderValue: 0,
};

CustomizedSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  sliderValue: PropTypes.number.required,
};
