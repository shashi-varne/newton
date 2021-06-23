import React from 'react'
import { Route, Switch } from 'react-router-dom'

import LandingOld from './pages/LandingOld'
import PersonalDetails from './pages/PersonalDetails'
import Steps from './pages/Steps'

function TaxFiling(props) {
  const { url } = props.match
  return (
    <Switch>
      <Route exact path={`${url}/landing-old`} component={LandingOld} />
      <Route exact path={`${url}/steps`} component={Steps} />
      <Route exact path={`${url}/personal-details`} component={PersonalDetails} />
    </Switch>
  )
}

export default TaxFiling
