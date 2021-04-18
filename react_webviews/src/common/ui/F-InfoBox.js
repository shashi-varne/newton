import React, { useState } from 'react';
import { copyToClipboard } from 'utils/validators';
import { isFunction } from 'lodash';
import toast from './Toast';

const InfoBox = ({
  image,
  imageAltText,
  children,
  btnText,
  handleBtnClick,
  contentToCopy,
  isCopiable,
  boxStyle,
  classes = {}
}) => {
  const [btnTitle, setBtnTitle] = useState(btnText || (isCopiable ? 'Copy' : ''));

  const onBtnClick = () => {
    if (isCopiable) {
      copyContent();
    } else if (btnText && isFunction(handleBtnClick)) {
      handleBtnClick();
    }
  }

  const copyContent = () => {
    if (copyToClipboard(contentToCopy)) {
      toast("Text copied");
      setBtnTitle('Copied');
      setTimeout(() => {
        setBtnTitle('Copy');
      }, 3000);
    }
  }

  if (btnText && isCopiable) {
    return (<span style={{ color: 'red' }}>
      Error: Cannot use both <b>ctrlText</b> and <b>isCopiable</b>
    </span>)
  }

  return (
    <div
      id="f-info-box"
      className={classes.root}
      style={boxStyle}>
      {image &&
        <div id="f-info-box-img">
          <img
            src={image}
            className={classes.img}
            alt={imageAltText}
          />
        </div>
      }
      <div
        id="f-info-box-body"
        className={classes.body}>
        {children}
      </div>
      {btnTitle &&
        <div
          id="f-info-box-ctrl"
          className={classes.ctrl}
          onClick={onBtnClick}
        >
          <span>{btnTitle}</span>
        </div>
      }
    </div>
  );
};

export default InfoBox;