/*

  Use:
    To provide a quick visual callback of the next step in a long journey
    (Used mainly in KYC Journey) 

  Example syntax:
    <WVJourneyShortening
      title="Next step" ***required***
      stepName="Complete esign and verify docs" ***required***
      stepActionText="Continue" ***required***
      stepActionType="completed" ('completed'/'pending')
      onStepActionClick={any function to execute on click of the "step-action" element}
    />
*/

import './JourneyShortening.scss';
import React from 'react';
import WVClickableTextElement from '../ClickableTextElement/WVClickableTextElement';
import PropTypes from 'prop-types';

const STEP_ACTION_COLOR_MAP = {
  completed: 'secondary',
  pending: '#B39712'
}

const WVJourneyShortening = ({
  dataAidSuffix,
  title, // Title text for the step
  stepName, // Name of the step
  stepActionText, // Text for clickable element in the step-action section
  stepActionType, // To set color of stepActionText - completed/pending [default=completed]
  onStepActionClick // Function to call when step-action is clicked
}) => {
  return (
    <div className="wv-journey-shortening" data-aid={`wv-journey-shortening-${dataAidSuffix}`}>
      <div className="wv-js-step-info">
        <div className="wv-jssi-title" data-aid={`wv-jssi-title-${dataAidSuffix}`}>
          {title}
        </div>
        <div className="wv-jssi-step-name" data-aid={`wv-jssi-step-name-${dataAidSuffix}`}>
          {stepName}
        </div>
      </div>
      {
        stepActionText &&
        <div className="wv-js-step-action" data-aid={`wv-js-step-action-${dataAidSuffix}`}>
          <WVClickableTextElement
            onClick={onStepActionClick}
            color={STEP_ACTION_COLOR_MAP[stepActionType]}
          >
            {stepActionText}
          </WVClickableTextElement>
        </div>
      }
    </div>
  );
}

WVJourneyShortening.propTypes = {
  title: PropTypes.node.isRequired,
  stepName: PropTypes.node.isRequired,
  stepActionText: PropTypes.string,
  stepActionType: PropTypes.oneOf(['pending', 'completed']),
  onStepActionClick: PropTypes.func
}

WVJourneyShortening.defaultProps = {
  stepActionType: 'completed',
  onStepActionClick: () => {}
}

export default WVJourneyShortening;