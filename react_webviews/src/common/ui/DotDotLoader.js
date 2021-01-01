import React, { Fragment } from 'react';
import './style.scss';
import { disableBodyTouch } from 'utils/validators';

const DotDotLoader = (props) => {

  disableBodyTouch();

  const { size = '' } = props;
   // eslint-disable-next-line
  let sizeObj = {};

  if (size) {
    sizeObj = { height: `${size}px !important`, width: `${size}px !important` };
  }

  return (
    <Fragment>
      <div className={`spinner ${props.className}`} style={props.style}>
        <div className="bounce1" style={props.styleBounce} />
        <div className="bounce2" style={props.styleBounce} />
        <div className="bounce3" style={props.styleBounce} />
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
