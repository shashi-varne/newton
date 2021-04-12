import React from 'react'
import { getConfig, isIframe } from 'utils/functions'

const Failed = () => {
  const productName = getConfig().productName;
  const iframe = isIframe();

  return (
    <div className="nsdl-status">
      {
        !iframe &&
        <img
        src={require(`assets/${productName}/ils_esign_failed.svg`)}
        style={{ width: '100%' }}
        alt="Nsdl Status"
        />
      }
      <div className="nsdl-status-text">
        Sorry! the eSign verification is failed. Please try again.
      </div>
    </div>
  )
}

export default Failed
