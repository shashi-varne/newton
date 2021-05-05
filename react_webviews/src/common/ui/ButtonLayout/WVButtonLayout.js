import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

/* ButtonLayout Component */

const WVButtonLayout = ({ layout, className, children }) => {
  return (
    <div className={`wv-button-layout-${layout} ${className}`}>
      {children}
    </div>
  );
}

WVButtonLayout.propTypes = {
  layout: PropTypes.oneOf(['stacked', 'horizontal']),
  className: PropTypes.string,
};

WVButtonLayout.defaultProps = {
  layout: 'horizontal',
  className: ''
};

/* Button Component */

const BUTTON_TYPE_PROPS = {
  primary: {
    variant: 'raised'
  },
  secondary: {
    variant: 'outlined'
  },
  text: {}
};

const LayoutButton = ({ order, title, classes, type, ...props }) => {
  let modifiedClasses = {
    root: `
      wv-layout-button
      wv-layout-button${order}
      wv-layout-button-${type}
      ${classes.root || ''}
    `,
    ...classes
  };

  return (
    <Button
      {...BUTTON_TYPE_PROPS[type]}
      fullWidth={true}
      autoFocus={true}
      size="large"
      color="secondary"
      classes={modifiedClasses}
      {...props}
    >
      {title}
    </Button>
  );
}

LayoutButton.propTypes = {
  order: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  type: PropTypes.oneOf(['primary', 'secondary', 'text']).isRequired,
  title: PropTypes.string.isRequired,
};

LayoutButton.defaultProps = {
  order: 1,
  classes:{}
};

WVButtonLayout.Button = LayoutButton;

/* OR Divider Component */

const ORDivider = () => (
  <img
    id="wv-or-divider"
    src={require('assets/ORDivider.svg')}
    alt="or"
    style={{ width: '100%', margin: '10px 0' }}
  />
);

WVButtonLayout.ORDivider = ORDivider;

/* EXPORTS */

export { WVButtonLayout };