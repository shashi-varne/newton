import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import './WVCard.scss'
/**
 * Component for showing a card
 */
function WVCard({ children, withShadow, className, dataAidSuffix, ...props }) {
  const defaultClass = withShadow ? 'wv-card wv-card__with-shadow' : 'wv-card'
  const classes = !isEmpty(className)
    ? `${defaultClass} ${className}`
    : defaultClass

  return (
    <div className={classes} {...props} data-aid={`wv-card-${dataAidSuffix}`}>
      {children || ''}
    </div>
  )
}

WVCard.propTypes = {
  children: PropTypes.element.isRequired,
  withShadow: PropTypes.bool,
}

WVCard.defaultProps = {
  withShadow: true,
}

export default WVCard
