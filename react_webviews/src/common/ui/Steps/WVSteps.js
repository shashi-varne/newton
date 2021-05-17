/*

Use: Show information that needs to be shown in the form of multiple steps

Example syntax:
  <WVSteps
    stepNum={1}
    title="Title content here" ***required***
  >
    Any content describing the step
  </WVSteps>
*/

import './WVSteps.scss';
import React from 'react';
import PropTypes from 'prop-types';

const WVSteps = ({
  title, // Title for the step
  stepNum, // Number to show for the step
  children // Content to show within step
}) => {
  return (
    <div className="wv-step">
      <div className="wv-step-header">
        <div id="wv-sh-number">{stepNum || '-'}</div>
        <div id="wv-sh-title">{title}</div>
      </div>
      <div className="wv-step-content">
        {children}
      </div>
    </div>
  );
}

export { WVSteps };

WVSteps.propTypes = {
  title: PropTypes.node.isRequired,
  stepNum: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  children: PropTypes.node.isRequired,
};

WVSteps.defaultProps = {
  children: ''
};

export default WVSteps