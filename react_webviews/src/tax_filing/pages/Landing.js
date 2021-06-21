import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'

const LandingPage = () => {
  const productName = getConfig().productName
  return (
    <Container>
      <h1>Welcome to tax2win tax filing landing page.</h1>
      <WVJourneyCard
        title="Title"
        subtitle="subtext min - one line / max three lines"
        iconSrc={require(`assets/${productName}/icn_self_itr.svg`)}
        stepCount={1}
      />
    </Container>
  )
}

const Title = () => {
  return <h1>Custom Title</h1>
}

const Subtitle = () => {
  return <h2>Custom Subtitle</h2>
}

export default LandingPage
