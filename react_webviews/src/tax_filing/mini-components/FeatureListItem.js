import React from 'react'
import './FeatureListItem.scss'

function FeatureListItem({ imgSrc, bgImgSrc, title, subtitle }) {
  return (
    <div className="flex align-start">
      <div
        className="tax-filing-feature-icn-container flex align-center justify-center"
        style={{ backgroundImage: `url(${bgImgSrc})` }}
      >
        <img src={imgSrc} alt={title} subtitle={subtitle} />
      </div>
      <div className="tax-filing-feature-content m-left-2x">
        <div className="heading3-medium">{title}</div>
        <div className="body-text2 text-secondary">{subtitle}</div>
      </div>
    </div>
  )
}

export default FeatureListItem
