import './Carousal.scss'

import React from 'react'
import PropTypes from 'prop-types'
import { getConfig } from 'utils/functions'

function Carousal({ title, subtitle, dataAidSuffix }) {
  const productName = getConfig().productName
  return (
    <div
      className="pd-2x tax-filing-carousal"
      style={{
        backgroundImage: `url(${require(`assets/${productName}/bg_crousal.svg`)})`,
      }}
      data-aid={dataAidSuffix}
    >
      <div className="relative flex space-between">
        <div className="heading2">{title}</div>
        <img
          className="block"
          src={require(`assets/${productName}/icn_tax_made_simple.svg`)}
          alt="Tax Made Simple"
        />
        <hr className="absolute inline-block pass-through" />
      </div>
      <div className="m-top-2x body-text2 tax-filing-carousal-subtitle">
        {subtitle}
      </div>
    </div>
  )
}

Carousal.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  dataAidSuffix: PropTypes.string,
}

Carousal.defaultProps = {
  title: '',
  subtitle: '',
  dataAidSuffix: '',
}

export default Carousal
