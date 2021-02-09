import React, { useEffect } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import UploadCard from './UploadCard'

import { getDocuments, initData } from '../services'
import { storageService } from '../../utils/validators'
import useInitData from '../hooks/useInitData'

const Progress = () => {
  const [state, setState] = useInitData()
  const documents = getDocuments(state.kyc)
  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      disable={state.loading}
      classOverRideContainer="pr-container"
      showSkelton={state.loading}
      skeltonType="p"
      fullWidthButton={true}
      handleClick={(event) => {
        console.log(event)
      }}
    >
      <section id="kyc-upload-progress"></section>
    </Container>
  )
}

export default Progress
