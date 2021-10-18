import React, { useEffect, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVTag from 'common/ui/Tag/WVTag'
import FeatureItem from '../mini-components/FeatureItem'
import WVCard from 'common/ui/Card/WVCard'
import { Imgc } from 'common/ui/Imgc'
import ListItem from 'common/ui/ListItem/WVListItem'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'

import { nativeCallback } from 'utils/native_callback'

import {
  TAX_FILING_OPTIONS,
  WHY_EFILE_REASONS,
  USER_SUMMARY_KEY,
  USER_DETAILS,
} from '../constants'
import {
  checkIfLandedByBackButton,
  clearITRSessionStorage,
  navigate as navigateFunc,
  setITRJourneyType,
  untrackBackButtonPress,
} from '../common/functions'
import { getITRUserDetails, getUserAccountSummary } from '../common/ApiCalls'
import { isEmpty } from 'lodash'

import { storageService } from '../../utils/validators'
import useResetTakeControl from '../hooks/useResetTakeControl'
import useBackButtonTracker from '../hooks/useBackButtonTracker'

import './Landing.scss'

function Landing(props) {
  const productName = getConfig().productName
  const navigate = navigateFunc.bind(props)
  const landedFromBackButton = checkIfLandedByBackButton()
  const cachedUserSummaryData =
    storageService().getObject(USER_SUMMARY_KEY) || {}

  const cachedUserDetails = storageService().getObject(USER_DETAILS) || {}
  const defaultUserDetails =
    landedFromBackButton && !isEmpty(cachedUserDetails) ? cachedUserDetails : {}

  const defaultUserSummaryDetails = isEmpty(cachedUserSummaryData)
    ? {}
    : cachedUserSummaryData

  const [user, setUser] = useState(defaultUserDetails)
  const [summary, setSummary] = useState(defaultUserSummaryDetails)
  const [errorData, setErrorData] = useState({})
  const [showError, setShowError] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const closeError = () => {
    setShowError(false)
  }

  const sendEvents = (userAction, data = {}) => {
    const investment_status = summary?.kyc?.investment_status || ''
    const kyc_status = summary?.kyc?.kyc_status || ''
    const personal_details_exist =
      !isEmpty(user?.name) && !isEmpty(user?.phone) && !isEmpty(user?.email)
        ? 'yes'
        : 'no'
    const eventObj = {
      event_name: 'ITR',
      properties: {
        user_action: userAction,
        screen_name: 'File ITR',
        card_click: data?.card_click || '',
        personal_details_exist: personal_details_exist,
        investment_status: investment_status === 'complete' ? 'Y' : 'N',
        kyc_status: kyc_status === 'compliant' ? 'Y' : 'N',
      },
    }
    if (userAction === 'just_set_events') {
      return eventObj
    } else {
      nativeCallback({ events: eventObj })
    }
  }

  const goBack = () => {
    clearITRSessionStorage()
    nativeCallback({ action: 'exit', events: sendEvents('back') })
  }

  useResetTakeControl()
  useBackButtonTracker()

  useEffect(() => {
    fetchITRUserSummary()
  }, [])

  const fetchITRUserSummary = async () => {
    try {
      if (!landedFromBackButton || isEmpty(user) || isEmpty(summary)) {
        setShowLoader(true)
        const [userDetails, summaryDetails] = await Promise.all([
          getITRUserDetails(),
          getUserAccountSummary(),
        ])
        setUser({ ...userDetails })
        setSummary({ ...summaryDetails })
        storageService().setObject(USER_DETAILS, userDetails)
        storageService().setObject(USER_SUMMARY_KEY, summaryDetails)
        setShowLoader(false)
        setShowError(false)
      }
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'crash',
        title2: err.message,
        handleClick1: closeError,
      })
      setShowLoader(false)
    }
    untrackBackButtonPress()
  }

  const handleFAQNavigation = () => {
    sendEvents('next', { card_click: 'FAQ' })
    navigate(`/tax-filing/faqs`, {}, false)
    return
  }

  const handleMyITRNavigation = () => {
    sendEvents('next', { card_click: 'my_ITR' })
    navigate(`/tax-filing/my-itr`, { summary, user }, false)
    return
  }

  const handleITRJourneyNavigation = (type) => () => {
    sendEvents('next', { card_click: type })
    setITRJourneyType(type)
    navigate(`/tax-filing/steps`, { type }, false)
    return
  }

  return (
    <Container
      title="File income tax returns (ITR)"
      buttonTitle={true}
      showError={showError}
      errorData={errorData}
      skelton={showLoader}
      headerData={{ goBack }}
      events={{ event_name: 'ITR', properties: {} }}
      noFooter
    >
      <div className="tax-filing-landing">
        <div className="body-text2">
          File ITR easily, quickly and with maximum tax savings
        </div>
        {user?.has_itr && (
          <WVCard
            classes={{
              container:
                'tax-filing-entry-card pointer flex align-center m-top-3x',
            }}
            onClick={handleMyITRNavigation}
            dataAidSuffix="tax-filing-my-itr"
          >
            <>
              <div className="block my-itr-icon">
                <Imgc src={require(`assets/icn_my_itr.svg`)} alt="MY ITR" />
              </div>
              <div className="m-left-2x heading3-medium text-white">My ITR</div>
            </>
          </WVCard>
        )}
        {TAX_FILING_OPTIONS.map(({ title, subtitle, icon, type }, idx) => {
          if (type === 'free') {
            return (
              <WVCard
                key={type}
                onClick={handleITRJourneyNavigation(type)}
                classes={{
                  container: 'pointer m-top-2x tax-filing-option-card',
                }}
                dataAidSuffix={`tax-filing-option-card-${title}`}
              >
                <ListItem
                  iconSrc={require(`assets/${productName}/${icon}.svg`)}
                  title={<CustomTitle title={title} />}
                  subtitle={subtitle}
                  classes={{ container: 'pointer row-reverse' }}
                  dataAidSuffix={`tax-filing-option-${type}`}
                  withRuler={false}
                />
              </WVCard>
            )
          } else {
            return (
              <WVCard
                key={type}
                onClick={handleITRJourneyNavigation(type)}
                classes={{
                  container: 'pointer m-top-2x tax-filing-option-card',
                }}
                dataAidSuffix={`tax-filing-option-card-${title}`}
              >
                <ListItem
                  key={title}
                  iconSrc={require(`assets/${productName}/${icon}.svg`)}
                  title={title}
                  subtitle={subtitle}
                  classes={{
                    container: 'pointer row-reverse',
                  }}
                  withRuler={false}
                  dataAidSuffix={`tax-filing-option-${type}`}
                />
              </WVCard>
            )
          }
        })}
        <div className="heading2 tax-filing-landing-features">
          Why eFile with us?
        </div>
        <div className="m-top-3x flex space-between">
          {WHY_EFILE_REASONS.map(({ icon, stats }, idx) => (
            <FeatureItem
              classes={{ container: `bg-whitegrey`, divider: `tax-filing-whyefile-divider` }}
              imgSrc={icon}
              title={stats}
              key={icon}
              lastItem={idx === WHY_EFILE_REASONS.length - 1}
            />
          ))}
        </div>
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
      </div>
    </Container>
  )
}

const CustomTitle = ({ title }) => {
  return (
    <div className="flex vertical-align-baseline">
      <div className="heading3-medium">{title}</div>
      <WVTag
        variant="attention"
        content="free"
        dataAidSuffix="tax2win-free-tag"
        classes={{ container: 'align-self-start m-left-1x' }}
      />
    </div>
  )
}

export default Landing
