import React from "react";
import Box from "@mui/material/Box";
import MuiSlider, { SliderThumb } from "@mui/material/Slider";
import "./Slider.scss";
import PropTypes from "prop-types";

const sliderArrow = require("assets/slider_arrow.svg");

const CustomThumb = (props) => {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <div className="slider-base">
        <img src={sliderArrow} className="slider-arrow" />
      </div>
    </SliderThumb>
  );
};

export default function Slider({
  min,
  max,
  step,
  onChange,
  disabled,
  sliderValue,
  dataAidSuffix,
}) {
  return (
    <Box className="customized-slider" data-aid={`slider_${dataAidSuffix}`}>
      <MuiSlider
        components={{ Thumb: CustomThumb }}
        min={min}
        max={max}
        onChange={onChange}
        step={step}
        value={sliderValue}
        disabled={disabled}
      />
    </Box>
  );
}

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  sliderValue: 0,
  dataAidSuffix: "",
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  sliderValue: PropTypes.number.required,
  dataAidSuffix: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};
