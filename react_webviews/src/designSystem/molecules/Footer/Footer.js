import React from 'react';
import Button from '../../atoms/Button';
import Stack from '@mui/material/Stack';
import isEmpty from 'lodash/isEmpty';
import ConfirmAction from '../ConfirmAction';

import './Footer.scss';

const Footer = ({
  direction = 'row',
  button1Props,
  button2Props,
  confirmActionProps,
  renderTopChild,
  renderBottomChild,
}) => {
  return (
    <div className='footer-wrapper'>
      {renderTopChild}
      <Stack direction={direction} className='footer-stack-wrapper'>
        {!isEmpty(confirmActionProps) && <ConfirmAction {...confirmActionProps} />}
        {button1Props?.title && (
          <Button title={button1Props?.title} onClick={button1Props?.onClick} {...button1Props} />
        )}
        {button2Props?.title && (
          <Button title={button2Props?.title} onClick={button2Props?.onClick} {...button2Props} />
        )}
      </Stack>
      {renderBottomChild}
    </div>
  );
};

export default Footer;
