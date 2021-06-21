import React from 'react'
import PropTypes from 'prop-types'

import { isFunction } from 'lodash'

import './WVTag.scss'

function WVTag({
  label,
  color,
  backgroundColor,
  dataAidSuffix,
  variant,
  classes,
  renderContent: Content,
  ...props
}) {
  return (
    <div
      className={`inline-block text-center small-text1 wv-tag wv-tag__${variant} ${classes?.container}`}
      style={{ backgroundColor, color }}
      data-aid={`wv-tag-${dataAidSuffix}`}
      {...props}
    >
      {isFunction(Content) ? (
        <Content />
      ) : (
        <div className={`${classes?.label}`}>{label}</div>
      )}
    </div>
  )
}

WVTag.propTypes = {
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  classes: PropTypes.shape({
    container: PropTypes.string,
    label: PropTypes.string,
  }),
  renderContent: PropTypes.func,
  props: PropTypes.object,
}

WVTag.defaultProps = {
  variant: 'attention',
  classes: {},
}

export default WVTag
