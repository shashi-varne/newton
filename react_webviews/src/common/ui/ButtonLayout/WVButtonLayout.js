/*

Use:
- To create button layouts/groupings (stacked vertically or spread horizontally)
- Buttons are automatically organised (spacing, alignment) within the layout container
- Can add additional components/text/elements within the layout

Example syntax:
  <WVButtonLayout
    layout="stacked" [default="horizontal"]
    className="someClass"
  >
    <WVButtonLayout.Button
      type="primary" (primary/secondary/text) ***required***
      title="Button title/text" ***required***
    />
    <WVButtonLayout.ORDivider />
    <WVButtonLayout.Button
      type="secondary" (primary/secondary/text) ***required***
      title="Button title/text" ***required***
    />
  </WVButtonLayout>
*/

import './WVButtonLayout.scss';
import React from 'react';
import PropTypes from 'prop-types';
import WVButton from '../Button/WVButton';

/* ButtonLayout Component */

const WVButtonLayout = ({
  dataAidSuffix,
  layout, // "stacked" or "horizontal"
  className, // classes for layout container
  children // any combination of button, text, elements, components
}) => {
  return (
    <div className={`wv-button-layout-${layout} ${className}`} data-aid={`wv-button-layout-${dataAidSuffix}`}>
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

const LayoutButton = ({
  title, // Button title/text content
  classes, // Button classes (refer MUI Button classes API)
  type, // "primary", "secondary", "text" button types
  ...props // MUI Button props
}) => {
  const { root: rootClass, ...otherClasses } = classes;
  const modifiedClasses = {
    root: `
      wv-layout-button
      wv-layout-button-${type}
      ${rootClass || ''}
    `,
    ...otherClasses
  };

  return (
    <WVButton
      {...BUTTON_TYPE_PROPS[type]}
      fullWidth={true}
      autoFocus={true}
      size="large"
      color="secondary"
      classes={modifiedClasses}
      {...props}
    >
      {title}
    </WVButton>
  );
}

LayoutButton.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary', 'text']).isRequired,
  title: PropTypes.string.isRequired,
};

LayoutButton.defaultProps = {
  classes: {}
};

WVButtonLayout.Button = LayoutButton;

/* OR-Divider Component */

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

export default WVButtonLayout;
