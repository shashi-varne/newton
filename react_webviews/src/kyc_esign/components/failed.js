import React from 'react'
import { getConfig, isNewIframeDesktopLayout } from 'utils/functions'

const productName = getConfig().productName;
const Failed = () => {

  return (
    <div className="nsdl-status" data-aid='nsdl-status'>
      {
        !isNewIframeDesktopLayout() &&
          <img
            src={require(`assets/${productName}/ils_esign_failed.svg`)}
            style={{ width: '100%' }}
            alt="Nsdl Status"
          />
      }
      <div className="nsdl-status-text" data-aid='nsdl-status-text'>
        Sorry! the eSign verification is failed. Please try again.
      </div>
    </div>
  )
}

export default Failed
