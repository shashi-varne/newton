import React, { Fragment, useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'
import { Imgc } from 'common/ui/Imgc'

import {
  taxFilingSteps,
  taxFilingAdvantages,
  ITR_TYPE_KEY,
  USER_SUMMARY_KEY,
} from '../constants'

import { navigate as navigateFunc } from '../common/functions'
import { getUserAccountSummary } from '../common/ApiCalls'

import './Steps.scss'
import { storageService } from '../../utils/validators'

function Steps(props) {
  const navigate = navigateFunc.bind(props)
  const [showLoader] = useState(false)

  const type =
    props?.location?.params?.type || storageService().get(ITR_TYPE_KEY)
  const productName = getConfig().productName
  const handleClick = async () => {
    let userSummary = {}
    try {
      userSummary = await getUserAccountSummary()
      storageService().setObject(USER_SUMMARY_KEY, userSummary)
    } catch (err) {
      userSummary = storageService().getObject(USER_SUMMARY_KEY)
    }
    navigate(`/tax-filing/personal-details`, { userSummary }, false)
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
