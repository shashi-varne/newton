import React from 'react';
import './style.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const CustomizedSlider = (props) => {

  const handleChange = (e) => {
    props.onChange(e)
  }

  return (
    <div className="slidecontainer">
      <Slider
        defaultValue={Number(props.default)}
        min={Number(props.min)}
        max={Number(props.max)}
        onChange={handleChange}
        trackStyle={{
          background: "#3792fc"
        }}
        railStyle={{
          height: 4
        }}
        handleStyle={{
          height: 15,
          width: 15,
          backgroundColor: "#fff",
          border: 0,
          boxShadow: '0 0 2px #000'
        }}
      />
    </div>
  );
};

export default CustomizedSlider;
