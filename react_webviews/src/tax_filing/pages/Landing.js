import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'
import WVTag from 'common/ui/Tag/WVTag'
import HowToSteps from 'common/ui/HowToSteps'
import StepsToFollow from '../../common/ui/stepsToFollow'
import Carousal from '../mini-components/Carousal'

// import { gettingStartedSteps } from '../constants'

// function GetStarted({ title = 'Why eFile with us?', steps }) {
//   const gettingStartedSteps = [
//     {
//       icon: 'icn_secure_safe',
//       title: 'Secure & Safe ',
//       subtitle: 'Income tax department authorized platform',
//     },
//     {
//       icon: 'icn_tax_savings',
//       title: 'Maximum tax savings',
//       subtitle: 'Get every tax deduction you are eligible for',
//     },
//     {
//       icon: 'icn_calculator',
//       title: '100% accuracy',
//       subtitle: 'Precise calculations to avoid overpaying of taxes',
//     },
//   ]
//   return (
//     <HowToSteps
//       style={{ margin: '0px 0px 0px 0px', paddingTop: 0 }}
//       baseData={{ title, options: gettingStartedSteps }}
//       classNameIcon="steps-icon"
//       showSkelton={true}
//     />
//   )
// }

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
      {/* <GetStarted /> */}
      <Carousal
        title="Taxation made simple"
        subtitle="File ITR easily, quickly and with maximum tax savings"
        dataAidSuffix="tax-filing-itr-carousel"
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
