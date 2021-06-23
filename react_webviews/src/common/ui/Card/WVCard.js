import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import './WVCard.scss'
/**
 * Component for showing a card
 */
function WVCard({ children, withShadow, classes, dataAidSuffix, ...props }) {
  const defaultClass = withShadow ? 'wv-card wv-card__with-shadow' : 'wv-card'
  return (
    <div
      className={`${defaultClass} ${classes?.container}`}
      {...props}
      data-aid={`wv-card-${dataAidSuffix}`}
    >
      {children || ''}
    </div>
  )
}

WVCard.propTypes = {
  children: PropTypes.element.isRequired,
  withShadow: PropTypes.bool,
  classes: PropTypes.exact({
    container: PropTypes.string,
  }),
}

WVCard.defaultProps = {
  withShadow: true,
  classes: {},
}

export default WVCard
