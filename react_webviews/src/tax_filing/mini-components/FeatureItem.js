import './FeatureItem.scss'

import React, { Fragment } from 'react'
import { Imgc } from 'common/ui/Imgc'

function FeatureItem({ classes, imgSrc, title, subtitle = '', lastItem }) {
  const containerClasses = classes?.container || ''
  const dividerClasses = classes?.divider || ''
  return (
    <Fragment>
      <div className="flex-column align-center">
        <div
          className={`tax-filing-feature-icon flex justify-center align-center ${containerClasses}`}
        >
          <Imgc src={require(`assets/${imgSrc}.svg`)} />
        </div>
        {title && (
          <div className="center body-text2 text-secondary m-top-1x tax-filing-feature-icon-title">
            {title}
          </div>
        )}
        {subtitle && (
          <div className="center body-text2 text-secondary tax-filing-feature-icon-subtitle">
            {subtitle}
          </div>
        )}
      </div>
      {!lastItem && <div className={`divider ${dividerClasses}`}></div>}
    </Fragment>
  )
}

export default FeatureItem
