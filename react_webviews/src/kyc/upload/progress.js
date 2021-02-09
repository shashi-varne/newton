import React, { useEffect, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import UploadCard from './UploadCard'

import { getDocuments, initData } from '../services'
import { isEmpty, storageService } from '../../utils/validators'
import useInitData from '../hooks/useInitData'

const Progress = () => {
  const { kyc, loading } = useInitData()
  console.log(kyc)
  let documents = []
  if (!loading && !isEmpty(kyc)) {
    documents = getDocuments(kyc)
  }
  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      disable={loading}
      classOverRideContainer="pr-container"
      showSkelton={loading}
      skeltonType="p"
      fullWidthButton={true}
      handleClick={(event) => {
        console.log(event)
      }}
      disable={true}
    >
      <section id="kyc-upload-progress">
        <div className="header">
          Upload Documents
        </div>
        <main className="documents">
          {documents.map(document => (
            <div key={document.title} className="document">
              <UploadCard default_image={document.default_image} title={document.title} onClick={() => {}}/>
            </div>
          ))}
        </main>
      </section>
    </Container>
  )
}

export default Progress
