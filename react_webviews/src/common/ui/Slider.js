import React from 'react';
import './style.css';
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

const CustomSlider = withStyles({
    root: {
      color: "#3792fc",
      height: 2
    },
    thumb: {
      height: 15,
      width: 15,
      backgroundColor: "#fff",
      // border: "2px solid currentColor",
      marginTop: -6,
      marginLeft: -12,
      boxShadow: "#ebebeb 0 2px 2px",
      "&:focus, &:hover, &$active": {
        boxShadow: "inherit"
      }
    },
    active: {},
    valueLabel: {
      left: "calc(-50% + 4px)"
    },
    track: {
      height: 4,
      borderRadius: 4
    },
    rail: {
      height: 4,
      borderRadius: 4
    }
  })(Slider);

  export default function CustomizedSlider() {
    
    return (
        <div>
            <Typography gutterBottom>custom slider</Typography>
            <CustomSlider 
              defaultValue={20}
            />
        </div>
    )
  }