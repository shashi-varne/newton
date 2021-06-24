import React, { useEffect, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVTag from 'common/ui/Tag/WVTag'
import Carousal from '../mini-components/Carousal'
import WVMenuListDropdownItem from 'common/ui/MenuListDropdown/WVMenuListDropdownItem'
import FeatureListItem from '../mini-components/FeatureListItem'
import WVCard from 'common/ui/Card/WVCard'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'

import { taxFilingOptions } from '../constants'
import {
  getTaxFilingFeatureLists,
  navigate as navigateFunc,
} from '../common/functions'
import { getITRList, getUserAccountSummary } from '../common/ApiCalls'
import { isEmpty } from 'lodash'

import { storageService } from '../../utils/validators'

import './Landing.scss'

function Landing(props) {
  const productName = getConfig().productName
  const navigate = navigateFunc.bind(props)

  const cachedUserData = storageService().getObject('ITR_USER_SUMMARY') || {}

  const [itrList, setItrList] = useState([])
  const [userSummary, setUserSummary] = useState(cachedUserData)
  const [errorData, setErrorData] = useState({})
  const [showError, setShowError] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const closeError = () => {
    setShowError(false)
  }

  useEffect(() => {
    fetchITRListAndUserSummary()
  }, [])

  const fetchITRListAndUserSummary = async () => {
    try {
      setShowLoader(true)
      if (isEmpty(userSummary)) {
        const [list, user] = await Promise.all([
          getITRList(),
          getUserAccountSummary(),
        ])
        setItrList([...list])
        setUserSummary({ ...user })
        storageService().setObject('ITR_USER_SUMMARY', user)
        setShowLoader(false)
        setShowError(false)
      } else {
        const list = await getITRList()
        setItrList([...list])
        setShowLoader(false)
        setShowError(false)
      }
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'crash',
        title1: err.message,
        handleClick1: closeError(),
      })
      setShowLoader(false)
    }
  }

  const handleFAQNavigation = () => {
    navigate(`/tax-filing/faqs`, {}, false)
  }

  const handleMyITRNavigation = () => {
    navigate(`/tax-filing/my-itr`, { itrList, userSummary }, false)
  }

  return (
    <Container
      title="File income tax returns (ITR)"
      buttonTitle="CONTINUE"
      showError={showError}
      errorData={errorData}
      skelton={showLoader}
      noFooter
    >
      <Carousal
        title="Taxation made simple"
        subtitle="File ITR easily, quickly and with maximum tax savings"
        dataAidSuffix="tax-filing-itr-carousel"
      />
      {itrList.length > 0 && (
        <WVCard
          classes={{
            container:
              'tax-filing-entry-card pointer flex align-center m-top-3x',
          }}
          onClick={handleMyITRNavigation}
        >
          <>
            <img src={require(`assets/icn_my_itr.svg`)} alt="MY ITR" />
            <div className="m-left-2x heading3-medium text-white">MY ITR</div>
          </>
        </WVCard>
      )}

      <div className="heading2 m-top-3x">Get Started</div>
      {taxFilingOptions.map(({ title, subtitle, icon }, idx) => {
        if (idx === 0) {
          return (
            <WVMenuListDropdownItem
              key={idx}
              image={require(`assets/${productName}/${icon}.svg`)}
              title={<CustomTitle title={title} />}
              subtitle={subtitle}
            />
          )
        } else {
          return (
            <WVMenuListDropdownItem
              key={idx}
              image={require(`assets/${productName}/${icon}.svg`)}
              title={title}
              subtitle={subtitle}
            />
          )
        }
      })}
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
            backgroundImage: `url(${require(`assets/${productName}/chat_bubble.svg`)})`,
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
      <div className="heading3-medium">{title}</div>
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
