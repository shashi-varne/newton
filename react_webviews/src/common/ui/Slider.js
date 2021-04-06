import React from 'react';
import './style.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getConfig } from 'utils/functions';

const CustomizedSlider = (props) => {

  const handleChange = (e) => {
    props.onChange(e)
  }

  return (
    <div className="slider">
      <Slider
        defaultValue={Number(props.default)}
        value={Number(props.value)}
        min={Number(props.min)}
        max={Number(props.max)}
        onChange={handleChange}
        disabled={props.disabled}
        trackStyle={{
          background: getConfig().primary
        }}
        railStyle={{
          height: 4
        }}
        handleStyle={{
          height: 15,
          width: 15,
          backgroundColor: "#fff",
          border: 0,
          boxShadow: '0 1px 1px grey'
        }}
      />
    </div>
  );
};

export default CustomizedSlider;
