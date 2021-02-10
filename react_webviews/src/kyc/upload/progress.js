import React, { useEffect, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import UploadCard from './UploadCard'

import { getDocuments, initData } from '../services'
import { isEmpty, storageService } from '../../utils/validators'
import { storageConstants } from '../constants'
import { toast } from 'react-toastify'

const Progress = () => {
  const [kyc, setKyc] = useState(storageService().getObject(storageConstants.KYC) || null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (isEmpty(kyc)) {
      initialize()
    }
  }, [])

  const initialize = async () => {
    try {
      setLoading(true)
      await initData()
      const kyc = storageService().getObject(storageConstants.KYC)
      setKyc(kyc)
    } catch (err) {
      console.error(err)
      toast(err.message)
    } finally {
      setLoading(false)
    }
  }

  let documents = []

  if (!isEmpty(kyc) && !loading) {
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
