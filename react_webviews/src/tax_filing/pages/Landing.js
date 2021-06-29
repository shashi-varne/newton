import React, { useEffect, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVTag from 'common/ui/Tag/WVTag'
import Carousal from '../mini-components/Carousal'
import WVMenuListDropdownItem from 'common/ui/MenuListDropdown/WVMenuListDropdownItem'
import FeatureListItem from '../mini-components/FeatureListItem'
import WVCard from 'common/ui/WVCards/WVCard'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'

import { nativeCallback } from 'utils/native_callback'

import {
  taxFilingOptions,
  USER_SUMMARY_KEY,
  ITR_APPLICATIONS_KEY,
} from '../constants'
import {
  checkIfLandedByBackButton,
  getTaxFilingFeatureLists,
  initBackButtonTracker,
  navigate as navigateFunc,
  setITRJourneyType,
  untrackBackButtonPress,
} from '../common/functions'
import { getITRList, getUserAccountSummary } from '../common/ApiCalls'
import { isEmpty } from 'lodash'

import { storageService } from '../../utils/validators'

import './Landing.scss'

function Landing(props) {
  const productName = getConfig().productName
  const navigate = navigateFunc.bind(props)
  const landedFromBackButton = checkIfLandedByBackButton()
  const cachedUserData = storageService().getObject(USER_SUMMARY_KEY) || {}
  const cachedITRApplications =
    storageService().getObject(ITR_APPLICATIONS_KEY) || []
  const defaultUserData =
    landedFromBackButton && !isEmpty(cachedUserData) ? cachedUserData : {}
  const defaultITRApplications =
    landedFromBackButton && !isEmpty(cachedITRApplications)
      ? cachedITRApplications
      : []

  const [itrList, setItrList] = useState(defaultITRApplications)
  const [userSummary, setUserSummary] = useState(defaultUserData)
  const [errorData, setErrorData] = useState({})
  const [showError, setShowError] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const closeError = () => {
    setShowError(false)
  }

  const sendEvents = (userAction, data = {}) => {
    const investment_status = userSummary?.kyc?.investment_status || ''
    const kyc_status = userSummary?.kyc?.kyc_status || ''
    const personal_details_exist =
      !isEmpty(userSummary?.user?.name) &&
      !isEmpty(userSummary?.user?.mobile) &&
      !isEmpty(userSummary?.user?.email)
        ? 'yes'
        : 'no'
    const eventObj = {
      event_name: 'ITR',
      properties: {
        user_action: userAction,
        screen_name: 'File ITR',
        card_click: data?.card_click || '',
        personal_details_exist: personal_details_exist,
        investment_status: investment_status ? 'Y' : 'N',
        kyc_status: kyc_status ? 'Y' : 'N',
      },
    }
    if (userAction === 'just_set_events') {
      return eventObj
    } else {
      nativeCallback({ events: eventObj })
    }
  }

  const goBack = () => {
    sendEvents('back')
    props.history.goBack()
  }

  useEffect(() => {
    initBackButtonTracker()
    fetchITRListAndUserSummary()
    return () => {
      untrackBackButtonPress()
    }
  }, [])

  const fetchITRListAndUserSummary = async () => {
    try {
      if (!landedFromBackButton || isEmpty(itrList) || isEmpty(userSummary)) {
        setShowLoader(true)
        const [list, summary] = await Promise.all([
          getITRList(),
          getUserAccountSummary(),
        ])
        setItrList([...list])
        setUserSummary({ ...summary })
        storageService().setObject(USER_SUMMARY_KEY, summary)
        storageService().setObject(ITR_APPLICATIONS_KEY, list)
        setShowLoader(false)
        setShowError(false)
      } else {
        setItrList([...cachedITRApplications])
        setUserSummary({ ...cachedUserData })
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
    untrackBackButtonPress()
  }

  const handleFAQNavigation = () => {
    sendEvents('next', { card_click: 'FAQ' })
    navigate(`/tax-filing/faqs`, {}, false)
  }

  const handleMyITRNavigation = () => {
    sendEvents('next', { card_click: 'my_ITR' })
    navigate(`/tax-filing/my-itr`, { itrList, userSummary }, false)
  }

  const handleITRJourneyNavigation = (type) => () => {
    sendEvents('next', { card_click: type })
    setITRJourneyType(type)
    navigate(`/tax-filing/steps`, { type, userSummary }, false)
  }

  return (
    <Container
      title="File income tax returns (ITR)"
      buttonTitle={true}
      showError={showError}
      errorData={errorData}
      skelton={showLoader}
      headerData={{ goBack }}
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
            <img
              src={require(`assets/icn_my_itr.svg`)}
              alt="MY ITR"
              className="block"
            />
            <div className="m-left-2x heading3-medium text-white">MY ITR</div>
          </>
        </WVCard>
      )}

      <div className="heading2 m-top-3x">Get Started</div>
      {taxFilingOptions.map(({ title, subtitle, icon, type }, idx) => {
        if (type === 'free') {
          return (
            <WVMenuListDropdownItem
              key={idx}
              image={require(`assets/${productName}/${icon}.svg`)}
              title={<CustomTitle title={title} />}
              subtitle={subtitle}
              onClick={handleITRJourneyNavigation(type)}
            />
          )
        } else {
          return (
            <WVMenuListDropdownItem
              key={idx}
              image={require(`assets/${productName}/${icon}.svg`)}
              title={title}
              subtitle={subtitle}
              onClick={handleITRJourneyNavigation(type)}
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
