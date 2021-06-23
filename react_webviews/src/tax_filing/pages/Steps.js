import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'

import { taxFilingSteps } from '../constants'

import { navigate as navigateFunc } from '../common/functions'

import './Steps.scss'

function Steps(props) {
  const navigate = navigateFunc.bind(props)
  const productName = getConfig().productName
  const handleClick = () => {
    navigate(`/tax-filing/personal-details`, {}, false)
  }
  return (
    <Container
      title="eFile in 3 easy steps"
      smallTitle={`Effortless, economic & error-free`}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      showLoader={false}
    >
      {taxFilingSteps.map(({ title, subtitle, icon }, idx) => (
        <WVJourneyCard
          key={title}
          title={title}
          classes={{ card: 'm-top-3x' }}
          subtitle={subtitle}
          iconSrc={require(`assets/${productName}/${icon}.svg`)}
          dataAidSuffix={`tax-filing-step-${idx}`}
          stepCount={idx + 1}
        />
      ))}
      {/**
       * @todo
       * Todo Our Advantages
       */}
    </Container>
  )
}

export default Steps
