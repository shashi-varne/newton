import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'
import WVTag from 'common/ui/Tag/WVTag'
import HowToSteps from 'common/ui/HowToSteps'
import StepsToFollow from '../../common/ui/stepsToFollow'

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
        withStep={true}
        withIcon={false}
        // classes={{
        //   step: 'pd-2x',
        // }}
      />
      <WVTag
        variant="success"
        label="free"
        dataAidSuffix="tax2win-free-tag"
        backgroundColor="#F0F7FF"
        color="#767E86"
      />
      {/* <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={this.state.screenData.stepContentMapper}
          /> */}
      <StepsToFollow
        key={0 + 1}
        keyId={0 + 1}
        title={'dasjdhasjkd'}
        subtitle={'dasjdhakjshdkajsd'}
      />
    </Container>
  )
}

const Title = ({ title }) => {
  return <h5>Custom {title}</h5>
}

const Subtitle = () => {
  return <h2>Custom Subtitle</h2>
}

export default LandingPage
