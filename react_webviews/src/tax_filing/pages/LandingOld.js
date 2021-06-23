import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'
import WVTag from 'common/ui/Tag/WVTag'
import Carousal from '../mini-components/Carousal'
import WVMenuListDropdownItem from '../../common/ui/MenuListDropdown/WVMenuListDropdownItem'
import FeatureListItem from '../mini-components/FeatureListItem'
import WVCard from 'common/ui/Card/WVCard'

import './Landing.scss'

// import { gettingStartedSteps } from '../constants'

function GetStarted({ title = 'Why eFile with us?', steps }) {
  const productName = getConfig().productName
  const gettingStartedSteps = [
    {
      frontImage: require('assets/icn_secure_safe.svg'),
      bgImage: require(`assets/${productName}/bg_why_icons.svg`),
      title: 'Secure & Safe ',
      subtitle: 'Income tax department authorized platform',
    },
    {
      frontImage: require('assets/icn_tax_savings.svg'),
      bgImage: require(`assets/${productName}/bg_why_icons.svg`),
      title: 'Maximum tax savings',
      subtitle: 'Get every tax deduction you are eligible for',
    },
    {
      frontImage: require('assets/icn_calculator.svg'),
      bgImage: require(`assets/${productName}/bg_why_icons.svg`),
      title: '100% accuracy',
      subtitle: 'Precise calculations to avoid overpaying of taxes',
    },
  ]
  return (
    <FeatureListItem
      imgSrc={require('assets/icn_secure_safe.svg')}
      bgImgSrc={require(`assets/${productName}/bg_why_icons.svg`)}
      title={`Secure & Safe`}
      subtitle={`Income tax department authorized platform`}
    />
  )
}

const LandingPage = () => {
  const productName = getConfig().productName

  return (
    <Container buttonTitle="CONTINUE">
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
      <WVTag variant="info" label="free" dataAidSuffix="tax2win-free-tag" />
      <GetStarted />
      <Carousal
        title="Taxation made simple"
        subtitle="File ITR easily, quickly and with maximum tax savings"
        dataAidSuffix="tax-filing-itr-carousel"
      />
      <WVMenuListDropdownItem
        image={require(`assets/${productName}/icn_self_itr.svg`)}
        title="asdasjkdhakjsdasd"
        subtitle="asdasjkdhasjkdhajksdhasjkhdjkasjksd"
      />
      <WVMenuListDropdownItem
        image={require(`assets/${productName}/icn_ca.svg`)}
        title={<Title title="Do it yourself" />}
        subtitle="asdasjkdhasjkdhajksdhasjkhdjkasjksd"
      ></WVMenuListDropdownItem>
      <WVCard
        classes={{
          container: 'tax-filing-entry-card pointer flex align-center',
        }}
      >
        <img src={require(`assets/icn_my_itr.svg`)} alt="MY ITR" />
        <div className="m-left-2x heading3-medium text-white">MY ITR</div>
      </WVCard>
    </Container>
  )
}

const Title = ({ title }) => {
  return (
    <div className="flex">
      <div className="heading3-medium">Do it yourself</div>
      <WVTag
        variant="attention"
        label="free"
        dataAidSuffix="tax2win-free-tag"
        classes={{ container: 'align-self-start m-left-2x' }}
      />
    </div>
  )
}

const Subtitle = () => {
  return <h2>Custom Subtitle</h2>
}

export default LandingPage
