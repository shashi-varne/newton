import React, { Fragment } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'
import WVJourneyCard from 'common/ui/Card/WVJourneyCard'
import { Imgc } from 'common/ui/Imgc'

import { taxFilingSteps, taxFilingAdvantages } from '../constants'

import { navigate as navigateFunc } from '../common/functions'

import './Steps.scss'

function Steps(props) {
  const navigate = navigateFunc.bind(props)
  const productName = getConfig().productName
  const handleClick = () => {
    navigate(`/tax-filing/personal-details`, {}, false)
    return
  }
  return (
    <Container
      title="eFile in 3 easy steps"
      smallTitle={`Effortless, economic & error-free`}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      showLoader={false}
    >
      {taxFilingSteps.map(({ title, subtitle, icon }, idx) => (
        <WVJourneyCard
          key={title}
          title={title}
          classes={{ card: 'm-top-3x' }}
          subtitle={subtitle}
          iconSrc={require(`assets/${productName}/${icon}.svg`)}
          dataAidSuffix={`tax-filing-step-${idx}`}
          stepCount={idx + 1}
        />
      ))}
      <div className="m-top-4x m-bottom-4x">
        <div className="heading2">Get Started</div>
        <div className="m-top-3x flex space-between">
          {taxFilingAdvantages.map(({ icon, stats, group }) => (
            <Fragment>
              <div className="flex-column align-center">
                <div className="tax-filing-advantages-icon flex justify-center align-center">
                  <Imgc src={require(`assets/${productName}/${icon}.svg`)} />
                </div>
                <div className="center body-text2 text-secondary m-top-1x">
                  {stats}
                </div>
                <div className="center body-text2 text-secondary">{group}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </Container>
  )
}

export default Steps
