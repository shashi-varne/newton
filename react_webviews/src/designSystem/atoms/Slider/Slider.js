import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider, { SliderThumb } from "@mui/material/Slider";
import "./Slider.scss";
import PropTypes from "prop-types";

const CustomThumb = (props) => {
  const { children, ...other } = props;
  const disabled = props?.children?.props?.disabled;
  const sliderBaseUrl = disabled
    ? require("assets/disabled_slider_base.svg")
    : require("assets/slider_base.svg");

  return (
    <SliderThumb {...other}>
      {children}
      <div className="slider-base">
        <img src={sliderBaseUrl} style={{ width: 42, height: 42 }} />
        <img
          src={require("assets/slider_arrow.svg")}
          className="slider-arrow"
        />
      </div>
    </SliderThumb>
  );
};

export default function CustomizedSlider({
  min,
  max,
  step,
  getSliderValue,
  disabled,
  value,
}) {
  const [sliderValue, setSliderValue] = useState(() => {
    return value || min;
  });
  const handleChange = (e, value) => {
    setSliderValue(value);
    getSliderValue(value);
  };
  return (
    <Box className="customized-slider">
      <Slider
        components={{ Thumb: CustomThumb }}
        min={min}
        max={max}
        onChange={handleChange}
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
};

CustomizedSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
};
