import React from 'react'

import { getConfig } from 'utils/functions'

import './FeatureListItem.scss'

function FeatureListItem({ classes, imgSrc, bgImgSrc, title, subtitle }) {
  const containerClasses = classes?.container
    ? `flex align-start ${classes?.container}`
    : `flex align-start`

  const productName = getConfig().productName
  
  return (
    <div className={containerClasses}>
      <div
        className="tax-filing-feature-icn-container flex align-center justify-center"
        style={{
          background: `url(${bgImgSrc})`,
        }}
      >
        <img src={imgSrc} alt={title} subtitle={subtitle} className="block" />
      </div>
      <div className="tax-filing-feature-content m-left-2x">
        <div className="heading3-medium">{title}</div>
        <div className="body-text2 text-secondary">{subtitle}</div>
      </div>
    </div>
  )
}

export default FeatureListItem
