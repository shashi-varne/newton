import './Steps.scss'

import React, { Fragment, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/JourneyCard/WVJourneyCard'
import { Imgc } from 'common/ui/Imgc'

import {
  taxFilingSteps,
  taxFilingAdvantages,
  ITR_TYPE_KEY,
  USER_SUMMARY_KEY,
  ITR_ID_KEY,
  ITR_APPLICATIONS_KEY,
} from '../constants'

import {
  navigate as navigateFunc,
  trackBackButtonPress,
  parsePhoneNumber,
} from '../common/functions'
import {
  createITRApplication,
  getITRUserDetails,
  getITRList,
} from '../common/ApiCalls'

import { storageService } from '../../utils/validators'
import { nativeCallback } from 'utils/native_callback'
import { isEmpty } from 'lodash'

function Steps(props) {
  const navigate = navigateFunc.bind(props)
  const type =
    props?.location?.params?.type || storageService().get(ITR_TYPE_KEY) || ''
  const summary = storageService().getObject(USER_SUMMARY_KEY) || {}

  const defaultITRList =
    props?.location?.params?.itrList ||
    storageService().get(ITR_APPLICATIONS_KEY) ||
    []

  const [showLoader, setShowLoader] = useState(false)
  const [showSkeltonLoader, setShowSkeltonLoader] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorData, setErrorData] = useState({})
  const [itrList, setITRList] = useState(defaultITRList)

  if (!type || !summary) {
    return (
      <Redirect
        to={{
          ...props?.location,
          pathname: '/tax-filing',
          search: getConfig().searchParams,
        }}
      />
    )
  }

  useEffect(() => {
    fetchItrList()
  }, [])

  const fetchItrList = async () => {
    if (!itrList) {
      try {
        setShowSkeltonLoader(true)
        const list = await getITRList()
        setITRList([...list])
        setShowSkeltonLoader(false)
        storageService().setObject(ITR_APPLICATIONS_KEY, list)
      } catch (err) {
        setShowError(true)
        setShowError({
          type: 'generic',
          title2: err.message,
          handleClick1: () => {
            closeError()
            fetchItrList()
          },
          handleClick2: closeError,
        })
      }
    }
  }

  const closeError = () => {
    setShowError(false)
  }

  const productName = getConfig().productName

  const sendEvents = (userAction, data = {}) => {
    const personal_details_exist =
      !isEmpty(data?.user?.name) &&
      !isEmpty(data?.user?.email) &&
      !isEmpty(data?.user?.phone)
        ? 'yes'
        : 'no'

    const investment_status = summary?.kyc?.investment_status ? 'Y' : 'N'
    const kyc_status = summary?.kyc?.investment_status ? 'Y' : 'N'
    let eventObj = {}
    if (userAction === 'next') {
      eventObj = {
        event_name: 'ITR',
        properties: {
          user_action: userAction,
          screen_name:
            type === 'eCA' ? 'Hire expert to efile' : 'eFile in 3 steps',
          personal_details_exist: personal_details_exist,
          investment_status: investment_status ? 'Y' : 'N',
          kyc_status: kyc_status ? 'Y' : 'N',
        },
      }
    } else {
      eventObj = {
        event_name: 'ITR',
        properties: {
          user_action: userAction,
          screen_name:
            type === 'eCA' ? 'Hire expert to efile' : 'eFile in 3 steps',
        },
      }
    }

    if (userAction === 'just_set_events') {
      return eventObj
    } else {
      nativeCallback({ events: eventObj })
    }
  }

  const goBack = () => {
    trackBackButtonPress(props?.history?.location?.pathname)
    sendEvents('back')
    props.history.goBack()
  }

  const retry = async () => {
    closeError()
    handleClick()
  }

  const handleClick = async () => {
    try {
      setShowLoader('button')

      const userDetails = await getITRUserDetails()
      if (
        !isEmpty(userDetails?.email) &&
        !isEmpty(userDetails?.phone) &&
        !isEmpty(userDetails?.name) &&
        itrList.length > 0 &&
        !isEmpty(type)
      ) {
        setShowLoader('button')
        const itr = await createITRApplication({
          type,
          email: userDetails?.email,
          phone: parsePhoneNumber(userDetails?.phone),
          name: userDetails?.name,
        })
        storageService().setObject(ITR_ID_KEY, itr.itr_id)
        sendEvents('next', { user: userDetails })
        setShowLoader(false)
        navigate(
          `/tax-filing/redirection`,
          { redirectionUrl: itr.sso_url },
          false
        )
        return
      } else {
        sendEvents('next', { user: userDetails })
        navigate(
          `/tax-filing/personal-details`,
          { user: userDetails, type },
          false
        )
        return
      }
    } catch (err) {
      setShowLoader(false)
      setShowError(true)
      setErrorData({
        type: 'generic',
        title2: err.message,
        handleClick1: retry,
        handleClick2: closeError,
      })
    }
  }

  const topTitle =
    type === 'eCA' ? 'Hire an expert to eFile' : 'eFile in 3 easy steps'

  const smallTitle =
    type === 'eCA'
      ? 'Customised, comprehensive and cost-effective'
      : 'Effortless, economic & error-free'

  return (
    <Container
      title={topTitle}
      smallTitle={smallTitle}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      skelton={showSkeltonLoader}
      showLoader={showLoader}
      showError={showError}
      errorData={errorData}
      headerData={{ goBack }}
    >
      <div className="m-bottom-4x">
        {taxFilingSteps[type].map(({ title, subtitle, icon }, idx) => (
          <WVJourneyCard
            key={idx}
            title={title}
            classes={{ card: 'm-top-3x' }}
            subtitle={subtitle}
            iconSrc={require(`assets/${productName}/${icon}.svg`)}
            dataAidSuffix={`tax-filing-step-${idx}`}
            stepCount={idx + 1}
          />
        ))}
      </div>
      {type === 'eCA' && (
        <div className="tax-filing-advantages">
          <div className="heading2">Our advantages</div>
          <div className="m-top-3x flex space-between">
            {taxFilingAdvantages.map(({ icon, stats, group }, idx) => (
              <Fragment key={idx}>
                <div className="flex-column align-center">
                  <div
                    className="tax-filing-advantages-icon flex justify-center align-center"
                    style={{
                      backgroundColor:
                        productName === 'finity' ? '#FAFCFF' : '',
                    }}
                  >
                    <Imgc src={require(`assets/${productName}/${icon}.svg`)} />
                  </div>
                  <div className="center body-text2 text-secondary m-top-1x">
                    {stats}
                  </div>
                  <div className="center body-text2 text-secondary">
                    {group}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}

export default Steps
