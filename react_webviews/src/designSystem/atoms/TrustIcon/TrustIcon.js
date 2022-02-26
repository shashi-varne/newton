import React from 'react';
import { Box } from '@mui/material';
import Icon from '../Icon';
import PropTypes from 'prop-types';
import SecureIcon from './SecureIcon';
import Contact from './Contact';
import Registration from './Registration';

import './TrustIcon.scss';

const TRUST_ICON_VARIANTS = {
  emandate: 'trust_icon_emandate',
  secure: <SecureIcon />,
  contact: <Contact/>,
  registration: <Registration />,
};

const TrustIcon = (props) => {
  const { className = '', opacity, margin, dataAid = '', variant, ...restProps } = props;
  const image = TRUST_ICON_VARIANTS[variant];
  return (
    <Box
      className={`atom-trust-icon ${className}`}
      data-aid={`trustIcon_${dataAid}`}
      sx={{ opacity, margin }}
      {...restProps}
    >
      {typeof image === 'string' ? (
        <Icon
          className='aemti-icon'
          src={require(`assets/${image}.svg`)}
          alt={TRUST_ICON_VARIANTS[variant]}
        />
      ) : (
        image
      )}
    </Box>
  );
};

TrustIcon.defaultProps = {
  variant: 'emandate',
};

TrustIcon.propTypes = {
  variant: PropTypes.oneOf(['emandate', 'secure', 'contact', 'registration']),
};

export default TrustIcon;
