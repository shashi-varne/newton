import React, { Fragment } from 'react';
import './style.scss';

const DotDotLoader = (props) => {
  return (
    <Fragment>
      <div className={`spinner ${props.className}`} style={props.style}>
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
      {
        props.text && <div className={`${props.textClass}`} style={props.textStyle}>
          {props.text}
        </div>
      }
    </Fragment>
  );
};

export default DotDotLoader;
