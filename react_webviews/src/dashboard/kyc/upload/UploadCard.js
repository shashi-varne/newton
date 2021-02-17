import React from 'react'
import { getConfig } from 'utils/functions'

const UploadCard = (props) => {
  const productName = getConfig().productName
  const { default_image, title, onClick } = props
  return (
    <div className="kyc-upload-card" onClick={onClick}>
      <img
        src={require(`assets/${productName}/${default_image}`)}
        alt={title}
        className="icon"
      />
      <div className="title">{title}</div>
    </div>
  )
}

export default UploadCard
