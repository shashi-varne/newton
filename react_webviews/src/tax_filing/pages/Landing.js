import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVTag from 'common/ui/Tag/WVTag'
import Carousal from '../mini-components/Carousal'
import WVMenuListDropdownItem from 'common/ui/MenuListDropdown/WVMenuListDropdownItem'
import FeatureListItem from '../mini-components/FeatureListItem'
import WVCard from 'common/ui/Card/WVCard'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'

import {
  getTaxFilingFeatureLists,
  navigate as navigateFunc,
} from '../common/functions'

import './Landing.scss'

function Landing(props) {
  const productName = getConfig().productName
  const navigate = navigateFunc.bind(props)
  const handleFAQNavigation = () => {
    navigate(`/tax-filing/faqs`, {}, false)
  }

  const handleMyITRNavigation = () => {
    navigate(`/tax-filing/my-itr`, {}, false)
  }
  return (
    <Container
      title="File income tax returns (ITR)"
      buttonTitle="CONTINUE"
      noFooter
    >
      <Carousal
        title="Taxation made simple"
        subtitle="File ITR easily, quickly and with maximum tax savings"
        dataAidSuffix="tax-filing-itr-carousel"
      />
      <WVCard
        classes={{
          container: 'tax-filing-entry-card pointer flex align-center m-top-3x',
        }}
        onClick={handleMyITRNavigation}
      >
        <>
          <img src={require(`assets/icn_my_itr.svg`)} alt="MY ITR" />
          <div className="m-left-2x heading3-medium text-white">MY ITR</div>
        </>
      </WVCard>
      <div className="heading2 m-top-3x">Get Started</div>
      <WVMenuListDropdownItem
        image={require(`assets/${productName}/icn_self_itr.svg`)}
        title="asdasjkdhakjsdasd"
        subtitle="asdasjkdhasjkdhajksdhasjkhdjkasjksd"
      />
      <WVMenuListDropdownItem
        image={require(`assets/${productName}/icn_ca.svg`)}
        title={<CustomTitle title="Do it yourself" />}
        subtitle="asdasjkdhasjkdhajksdhasjkhdjkasjksd"
      ></WVMenuListDropdownItem>
      <div className="heading2 m-top-3x">Why eFile with us?</div>
      {getTaxFilingFeatureLists().map((item, idx) => (
        <FeatureListItem
          imgSrc={item.frontImage}
          bgImgSrc={item.bgImage}
          title={item.title}
          subtitle={item.subtitle}
          classes={{ container: 'm-top-3x' }}
          key={idx}
        />
      ))}
      <div
        className="pointer m-top-4x flex align-center pointer tax-filing-faq-section"
        onClick={handleFAQNavigation}
      >
        <div
          style={{
            backgroundImage: `url(${require(`assets/chat_bubble.svg`)})`,
            width: '22.92px',
            height: '22.92px',
          }}
          className="tax-filing-faq-icon flex align-center justify-center"
        >
          <div className="tax-filing-faq-icon-text">?</div>
        </div>
        <div className="tax-filing-faq-subtitle m-left-2x">
          Frequently asked questions
        </div>
      </div>
      <Tax2WinLogo classes={{ container: 'm-top-4x' }} />
      <div className="m-top-2x centered">
        <div className="body-text2 center text-secondary">
          For any query, reach us at
        </div>
        <div className="small-text1 center text-secondary uppercase">
          support@tax2win.in
        </div>
      </div>
    </Container>
  )
}

const CustomTitle = ({ title }) => {
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

export default Landing
