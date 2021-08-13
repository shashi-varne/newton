
/*

Use: Card-style UI for journey summary (eg. currently used in KYC Journey)

Example syntax:
  <WVJourneyCard
    title={title}
    subtitle={subtitle}
    iconSrc={require(`assets/${productName}/${icon}.svg`)}
    dataAidSuffix=".."
    stepCount={1}
  />

*/

import './WVJourneyCard.scss'
import React from 'react'
import PropTypes from 'prop-types'
import WVCard from '../Card/WVCard'
import { Imgc } from '../Imgc'
function WVJourneyCard({
  title,
  subtitle,
  withStep, // Boolean to show step count as identifier for step
  stepCount, // Renders a step count to the left of step, if required
  withIcon, // Boolean to show icon instead of step count as identifier for step
  iconSrc, // Image element to render within step identifier, if required
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
      <div className={`flex-between align-center ${classes?.container}`}>
        <div className={`wv-journey-card-content ${classes?.content}`}>
          {title && (
            <Title dataAidSuffix={dataAidSuffix} classes={classes}>
              {title}
            </Title>
          )}
          {subtitle && (
            <Subtitle dataAidSuffix={dataAidSuffix} classes={classes}>
              {subtitle}
            </Subtitle>
          )}
        </div>
        {withIcon && (
          <div className={`block wv-journey-card-icon ${classes?.icon}`}>
            <Imgc src={iconSrc} alt="" />
          </div>
        )}
        {withStep && (
          <StepCount count={stepCount} classes={{ step: classes.step }} />
        )}
      </div>
    </WVCard>
  )
}

function Title({ dataAidSuffix, classes, children }) {
  return (
    <div
      className={`body-text1 ${classes?.title}`}
      data-aid={`wv-journey-card-title-${dataAidSuffix}`}
    >
      {children}
    </div>
  )
}

function Subtitle({ dataAidSuffix, classes, children }) {
  return (
    <div
      className={`body-text2 ${classes?.subtitle}`}
      data-aid={`wv-journey-card-subtitle-${dataAidSuffix}`}
    >
      {children}
    </div>
  )
}

WVJourneyCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
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
