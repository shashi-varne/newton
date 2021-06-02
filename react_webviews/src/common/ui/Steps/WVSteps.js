/*

Use: Show information that needs to be shown in the form of multiple steps

Example syntax:
  <WVSteps
    stepNum={1}
    stepType="pending" (default/pending/completed)
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
  stepType, // Sets step index circle color and content - values: default/pending/completed [default='default']
  children, // Content to show within step
  classes // additional styling support
}) => {
  return (
    <div className={`wv-step ${classes.stepContainer}`}>
      <div className="wv-step-header" data-aid='wv-step-header'>
        <div
          id="wv-sh-number"
          data-aid='wv-sh-number'
          className={`wv-sh-number-${stepType} ${classes.stepNumber}`}
        >
          {/* If type is 'completed, default content is a success badge */}
          {stepType === 'completed' ?
            (stepNum || checkImg) :
            stepNum
          }
        </div>
        <div id="wv-sh-title" data-aid='wv-sh-title'>{title}</div>
      </div>
      <div className={`wv-step-content ${classes.stepContent}`} data-aid='wv-step-content'>
        {children}
      </div>
    </div>
  );
}

const checkImg = (
  <img src={require('assets/badge-success.svg')} alt="" />
);

WVSteps.propTypes = {
  title: PropTypes.node.isRequired,
  stepNum: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  children: PropTypes.node.isRequired,
  stepType: PropTypes.oneOf(['default', 'pending', 'completed'])
};

WVSteps.defaultProps = {
  children: '',
  stepType: 'default',
  classes: {}
};

export default WVSteps