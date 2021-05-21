import './JourneyShortening.scss';
import React from 'react';
import WVClickableTextElement from '../ClickableTextElement/WVClickableTextElement';
import PropTypes from 'prop-types';

const STEP_ACTION_COLOR_MAP = {
  completed: 'secondary',
  pending: '#B39712'
}

const WVJourneyShortening = ({
  title,
  stepName,
  stepActionText,
  stepActionType,
  onStepActionClick
}) => {
  return (
    <div className="wv-journey-shortening">
      <div className="wv-js-step-info">
        <div className="wv-jssi-title">
          {title}
        </div>
        <div className="wv-jssi-step-name">
          {stepName}
        </div>
      </div>
      <div className="wv-js-step-action">
        <WVClickableTextElement
          onClick={onStepActionClick}
          color={STEP_ACTION_COLOR_MAP[stepActionType]}
        >
          {stepActionText}
        </WVClickableTextElement>
      </div>
    </div>
  );
}

WVJourneyShortening.propTypes = {
  title: PropTypes.string.isRequired,
  stepName: PropTypes.string.isRequired,
  stepActionText: PropTypes.string.isRequired,
  stepActionType: PropTypes.oneOf(['pending', 'completed']),
  onStepActionClick: PropTypes.func
}

WVJourneyShortening.defaultProps = {
  stepActionType: 'completed',
  onStepActionClick: () => {}
}

export default WVJourneyShortening;