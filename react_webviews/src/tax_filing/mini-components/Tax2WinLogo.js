import React from 'react'
import PropTypes from 'prop-types'
import './Tax2WinLogo.scss'

function Tax2WinLogo({ classes, ...props }) {
  const containerClasses = classes?.container
    ? `tax-filing-tax2win-logo centered ${classes?.container}`
    : `tax-filing-tax2win-logo centered`
  return (
    <div className={containerClasses} {...props}>
      <img
        src={require(`assets/logo_tax2win.svg`)}
        className="block centered"
        alt="Tax2Win Logo"
      />
      <div
        className="helping-text text-secondary center"
        style={{ marginTop: '7px' }}
      >
        (A Fisdom company)
      </div>
    </div>
  )
}

Tax2WinLogo.propTypes = {
  classes: PropTypes.exact({
    container: PropTypes.string,
  }),
}

Tax2WinLogo.defaultProps = {
  classes: {},
}

export default Tax2WinLogo
