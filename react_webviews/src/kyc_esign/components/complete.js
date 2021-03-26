import React from 'react'
import { getConfig } from 'utils/functions'

const Complete = ({ }) => {
  const productName = getConfig().productName
  return (
    <div className="nsdl-status">
      <section className="nsdl-success">
        <img
          src={require(`assets/${productName}/ic_process_done.svg`)}
          className="done-image"
          alt=""
        />
      </section>
    </div>
  )
}

export default Complete
