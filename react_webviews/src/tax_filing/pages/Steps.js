import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'

import { taxFilingSteps } from '../constants'

import './Steps.scss'

function Steps(props) {
  const productName = getConfig().productName
  return (
    <Container
      title="eFile in 3 easy steps"
      smallTitle={`Effortless, economic & error-free`}
    >
      {taxFilingSteps.map(({ title, subtitle, icon }, idx) => (
        <WVJourneyCard
          key={title}
          title={title}
          classes={{ card: 'm-top-3x' }}
          subtitle={subtitle}
          iconSrc={require(`assets/${productName}/${icon}.svg`)}
          dataAidSuffix={`tax-filing-step-${title}`}
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
