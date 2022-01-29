import React from 'react';
import Button from '../../atoms/Button';
import Stack from '@mui/material/Stack';

import './Footer.scss';

const Footer = ({ direction = 'row', button1Props, button2Props, renderTopChild, renderBottomChild }) => {
  return (
    <footer className='footer-wrapper'>
      {renderTopChild}
      <Stack direction={direction} className='footer-stack-wrapper'>
        {button1Props?.title && (
          <Button title={button1Props?.title} onClick={button1Props?.onClick} {...button1Props} />
        )}
        {button2Props?.title && (
          <Button title={button2Props?.title} onClick={button2Props?.onClick} {...button2Props} />
        )}
      </Stack>
      {renderBottomChild}
    </footer>
  );
};

export default Footer;
