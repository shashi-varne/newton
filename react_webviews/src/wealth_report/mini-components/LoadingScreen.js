import React from 'react';
import { getConfig } from "utils/functions";
import { CircularProgress } from '@material-ui/core';
const isMobileView = getConfig().isMobileDevice;

const LoadingScreen = (props) => {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      backgroundColor: "#ffffff",
    }}>
      <div
        style={{
          textAlign: 'center',
          position: 'relative',
          top: `${isMobileView ? 40 : 55}%`,
          margin: 'auto',
        }}
      >
        <CircularProgress size={isMobileView ? 65 : 80} thickness={4} />
        <div
          style={{
            fontSize: isMobileView ? '18px' : '22px',
            marginTop: '45px'
          }}>
          {props.text}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;