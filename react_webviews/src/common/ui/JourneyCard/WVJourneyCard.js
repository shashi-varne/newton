import './WVJourneyCard.scss'

import React from 'react'
import PropTypes from 'prop-types'
import WVCard from '../Card/WVCard'
import { isFunction } from 'lodash'


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
      classes={{
        container: `wv-journey-card wv-journey-card__with-step ${classes?.card}`,
      }}
      withShadow={false}
      dataAidSuffix={`wv-journey-card-${dataAidSuffix}`}
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
        {withStep && (
          <StepCount count={stepCount} classes={{ step: classes.step }} />
        )}
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
  classes: PropTypes.exact({
    card: PropTypes.string,
    container: PropTypes.string,
    content: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    icon: PropTypes.string,
    step: PropTypes.string,
  }),
}

WVJourneyCard.defaultProps = {
  withStep: true,
  withIcon: true,
  title: '',
  subtitle: '',
  iconSrc: '',
  classes: {
    card: '',
    container: '',
    content: '',
    title: '',
    subtitle: '',
    icon: '',
    step: '',
  },
}

export function StepCount({ count, classes }) {
  return <div className={`wv-journey-card-step ${classes?.step}`}>{count}</div>
}

StepCount.propTypes = {
  count: PropTypes.number,
  classes: PropTypes.exact({
    step: PropTypes.string,
  }),
}

export default WVJourneyCard
