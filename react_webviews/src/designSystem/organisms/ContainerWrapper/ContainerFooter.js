import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Box } from '@mui/material';
import Footer from '../../molecules/Footer';

const ContainerFooter = ({
  fixedFooter,
  renderComponentAboveFooter,
  footer,
  noFooter,
  footerElevation,
}) => {
  return (
    <div className={`container-footer-wrapper ${fixedFooter && 'container-fixed-footer'}`}>
      {renderComponentAboveFooter}
      <div className='container-footer-child-wrapper'>
        {!isEmpty(footer) && !noFooter && (
          <Box
            sx={footerElevation ? footerSxStyle : {}}
            component='footer'
            className='container-footer-cta'
          >
            <Footer
              wrapperClassName='footer-wrapper'
              stackWrapperClassName='footer-stack-wrapper'
              {...footer}
            />
          </Box>
        )}
      </div>
    </div>
  );
};

export default ContainerFooter;

const footerSxStyle = (theme) => {
  return {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'foundationColors.supporting.white',
      boxShadow: '1',
    },
  };
};
