import React from 'react';
import './style.scss';

const DotDotLoader = (props) => {
  return (
    <div className="spinner" style={props.style}>
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
};

export default DotDotLoader;
