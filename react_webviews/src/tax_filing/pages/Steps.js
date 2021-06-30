import React, { Fragment, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/WVCards/WVJourneyCard'
import { Imgc } from 'common/ui/Imgc'

import {
  taxFilingSteps,
  taxFilingAdvantages,
  ITR_TYPE_KEY,
  USER_SUMMARY_KEY,
  ITR_ID_KEY,
  USER_DETAILS,
} from '../constants'

import {
  navigate as navigateFunc,
  trackBackButtonPress,
} from '../common/functions'
import {
  createITRApplication,
  getITRUserDetails,
  getUserAccountSummary,
} from '../common/ApiCalls'

import './Steps.scss'
import { isEmpty, storageService } from '../../utils/validators'
import { nativeCallback } from 'utils/native_callback'

function Steps(props) {
  const navigate = navigateFunc.bind(props)
  const [showLoader, setShowLoader] = useState(false)

  let type = props?.location?.params?.type || storageService().get(ITR_TYPE_KEY)
  let summary =
    props?.location?.params?.summary || storageService().getObject(USER_SUMMARY_KEY)

  let user = props?.location?.params?.user || storageService().getObject(USER_DETAILS)

  if (!type) {
    navigate('/tax-filing', {}, false)
    return ''
  }

  const productName = getConfig().productName

  const sendEvents = (userAction, data = {}) => {
    const personal_details_exist =
      !isEmpty(user?.name) && !isEmpty(user?.email) && !isEmpty(user?.mobile)
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

  const handleClick = async () => {
    try {
      setShowLoader('button')
      if (isEmpty(user)) {
        user = await getITRUserDetails()
        storageService().setObject(USER_DETAILS, user)
      }

      if (!type) {
        navigate('/tax-filing', {}, false)
        return
      }

      if (
        !isEmpty(user?.email) &&
        !isEmpty(user?.phone) &&
        !isEmpty(user?.name) &&
        !isEmpty(type)
      ) {
        setShowLoader('button')
        const itr = await createITRApplication({
          type,
          email: user?.email,
          phone: user?.mobile,
          name: user?.name,
        })
        storageService().setObject(ITR_ID_KEY, itr.itr_id)
        setShowLoader(false)
        sendEvents('next')
        navigate(
          `/tax-filing/redirection`,
          { redirectionUrl: itr.sso_url },
          false
        )
        return
      } else {
        sendEvents('next')
        navigate(
          `/tax-filing/personal-details`,
          { summary },
          false
        )
        return
      }
    } catch (err) {
      summary = storageService().getObject(USER_SUMMARY_KEY)
      user = storageService().getObject(USER_DETAILS)
      type = storageService().get(ITR_TYPE_KEY)
      if (!type) {
        setShowLoader(false)
        navigate('/tax-filing', {}, false)
        return
      }
      if (
        !isEmpty(user?.email) &&
        !isEmpty(user?.phone) &&
        !isEmpty(user?.name) &&
        type
      ) {
        try {
          const itr = await createITRApplication({
            email: user?.email,
            phone: user?.phone,
            name: user?.name,
            type,
          })
          storageService().setObject(ITR_ID_KEY, itr.itr_id)
          setShowLoader(false)
          sendEvents('next')
          navigate(
            `/tax-filing/redirection`,
            { redirectionUrl: itr.sso_url },
            false
          )
          return
        } catch (err) {
          setShowLoader(false)
          sendEvents('next')
          navigate(`/tax-filing/personal-details`, { summary }, false)
          return
        }
      } else {
        setShowLoader(false)
        sendEvents('next')
        navigate(`/tax-filing/personal-details`, { summary }, false)
        return
      }
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
      showLoader={showLoader}
      headerData={{ goBack }}
      classOverRideContainer="m-bottom-4x"
    >
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
      {type === 'eCA' && (
        <div className="m-top-4x">
          <div className="heading2">Get Started</div>
          <div className="m-top-3x flex space-between">
            {taxFilingAdvantages.map(({ icon, stats, group }, idx) => (
              <Fragment key={idx}>
                <div className="flex-column align-center">
                  <div
                    className="tax-filing-advantages-icon flex justify-center align-center"
                    style={{
                      backgroundColor:
                        productName === 'finity' ? '#E6F2FE' : '',
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
