import React from 'react'

const UploadCard = props => {
  const { src, title, ...parentProps } = props
  return (
    <div className="kyc-upload-card">
      <img src={src} alt={title} className="icon" />
      <div className="title">
        {title}
      </div>
    </div>
  )
}

export default UploadCard