import './WVListItem.scss'

import React from 'react'
import PropTypes from 'prop-types'
import { Imgc } from '../Imgc'

function ListItem({
  title,
  subtitle,
  iconSrc,
  classes,
  dataAidSuffix,
  withIcon,
  withRuler,
  ...props
}) {
  const containerClasses = classes?.container
    ? `wv-list-item-container flex ${classes?.container}`
    : `wv-list-item-container flex`
  const iconClasses = classes?.icon
    ? `wv-list-item-icon ${classes.icon}`
    : `wv-list-item-icon`
  const contentClasses = classes?.content
    ? `wv-list-item-content ${classes?.content}`
    : `wv-list-item-content`
  const rulerClasses = classes?.ruler
    ? `wv-list-item-ruler ${classes?.ruler}`
    : `wv-list-item-ruler`
  return (
    <div
      className={containerClasses}
      data-aid={`wv-list-item-${dataAidSuffix}`}
      {...props}
    >
      {withIcon && <Imgc src={iconSrc} className={iconClasses} />}
      <div className={contentClasses}>
        {title && (
          <Title classes={classes} dataAidSuffix={dataAidSuffix}>
            {title}
          </Title>
        )}
        {subtitle && (
          <Subtitle classes={classes} dataAidSuffix={dataAidSuffix}>
            {subtitle}
          </Subtitle>
        )}
        {withRuler && (
          <div
            className={rulerClasses}
            data-aid={`wv-list-item-ruler-${dataAidSuffix}`}
          />
        )}
      </div>
    </div>
  )
}

function Title({ children, classes, dataAidSuffix }) {
  const titleClasses = classes?.title
    ? `heading3-medium ${classes.title}`
    : `heading3-medium`
  return (
    <div
      className={titleClasses}
      data-aid={`wv-list-item-title ${dataAidSuffix}`}
    >
      {children}
    </div>
  )
}

function Subtitle({ children, classes, dataAidSuffix }) {
  const subtitleClasses = classes?.subtitle
    ? `body-text2 text-secondary ${classes.subtitle}`
    : `body-text2 text-secondary`
  return (
    <div
      className={subtitleClasses}
      data-aid={`wv-list-item-subtitle ${dataAidSuffix}`}
    >
      {children}
    </div>
  )
}

ListItem.propTypes = {
  withIcon: PropTypes.bool,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
  iconSrc: PropTypes.string,
  classes: PropTypes.exact({
    container: PropTypes.string,
    content: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    ruler: PropTypes.string,
  }),
}

ListItem.defaultProps = {
  withIcon: true,
  withRuler: true,
}

export default ListItem
