import React from 'react'
import { getConfig } from 'utils/functions'

const Failed = () => {
  const productName = getConfig().productName

  return (
    <div className="nsdl-status" data-aid='nsdl-status'>
      <img
        src={require(`assets/${productName}/ils_esign_failed.svg`)}
        style={{ width: '100%' }}
        alt="Nsdl Status"
      />
      <div className="nsdl-status-text" data-aid='nsdl-status-text'>
        Sorry! the eSign verification is failed. Please try again.
      </div>
    </div>
  )
}

export default Failed
