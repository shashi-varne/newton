import React from 'react'
import PropTypes from 'prop-types'
import WVCard from './WVCard'
import { isEmpty, isFunction } from 'lodash'

import './WVJourneyCard.scss'

function WVJourneyCard({
  title,
  subtitle,
  iconSrc,
  renderTitle: Title,
  renderSubtitle: Subtitle,
  withStep,
  withIcon,
  stepCount,
  classes,
  dataAidSuffix,
  ...props
}) {
  return (
    <WVCard
      className="wv-journey-card wv-journey-card__with-step"
      withShadow={false}
      data-aid={`wv-journey-card ${dataAidSuffix}`}
      {...props}
    >
      <div className={`flex-between ${classes?.container}`}>
        <div className={`wv-journey-card-content ${classes?.content}`}>
          {isFunction(Title) ? (
            <Title />
          ) : (
            <div className={`body-text1 ${classes?.title}`}>{title}</div>
          )}
          {isFunction(Subtitle) ? (
            <Subtitle />
          ) : (
            <div className={`body-text2 ${classes?.subtitle}`}>{subtitle}</div>
          )}
        </div>
        {withIcon && (
          <img
            className={`wv-journey-card-icon ${classes?.icon}`}
            src={iconSrc}
            alt={title}
          />
        )}
        {withStep && <StepCount count={stepCount} />}
      </div>
    </WVCard>
  )
}

WVJourneyCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  iconSrc: PropTypes.string,
  renderTitle: PropTypes.func,
  renderSubtitle: PropTypes.func,
  stepCount: PropTypes.number,
}

WVJourneyCard.defaultProps = {
  withStep: true,
  withIcon: true,
  title: '',
  subtitle: '',
  iconSrc: '',
  classes: {},
}

export function StepCount({ count }) {
  return <div className="wv-journey-card-step">{count}</div>
}

StepCount.propTypes = {
  count: PropTypes.number,
}

export default WVJourneyCard
