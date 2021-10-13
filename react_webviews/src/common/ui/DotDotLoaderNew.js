import React, { Fragment } from 'react';
import './style.scss';

const DotDotLoader = (props) => {
  const { size = '' } = props;
   // eslint-disable-next-line
  let sizeObj = {};

  if (size) {
    sizeObj = { height: `${size}px !important`, width: `${size}px !important` };
  }

  return (
    <Fragment>
      <div className="dot-flashing-parent" >
          <div className={`dot-flashing ${props.className}`} style={props.style}></div>
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
