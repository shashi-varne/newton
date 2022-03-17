import React from 'react';
import Button from '../../atoms/Button';
import Stack from '@mui/material/Stack';
import ConfirmAction from '../ConfirmAction';

import './Footer.scss';

const Footer = ({
  direction = 'row',
  button1Props,
  button2Props,
  confirmActionProps,
  hideButton1,
  hideButton2,
  hideConfirmAction,
  renderTopChild,
  renderBottomChild,
  wrapperClassName,
  stackWrapperClassName,
}) => {
  return (
    <div className={wrapperClassName}>
      {renderTopChild}
      <Stack direction={direction} className={stackWrapperClassName}>
        {confirmActionProps?.buttonTitle && !hideConfirmAction && (
          <ConfirmAction {...confirmActionProps} />
        )}
        {button1Props?.title && !hideButton1 && (
          <Button title={button1Props?.title} onClick={button1Props?.onClick} {...button1Props} />
        )}
        {button2Props?.title && !hideButton2 && (
          <Button title={button2Props?.title} onClick={button2Props?.onClick} {...button2Props} />
        )}
      </Stack>
      {renderBottomChild}
    </div>
  );
};

export default Footer;
