import React from 'react'
import { Route, Switch } from 'react-router-dom'

import LandingOld from './pages/LandingOld'
import PersonalDetails from './pages/PersonalDetails'
import Steps from './pages/Steps'
import MyITR from './pages/MyITR'
import Redirection from './pages/Redirection'

function TaxFiling(props) {
  const { url } = props.match
  return (
    <Switch>
      <Route exact path={`${url}/landing-old`} component={LandingOld} />
      <Route exact path={`${url}/steps`} component={Steps} />
      <Route exact path={`${url}/personal-details`} component={PersonalDetails} />
      <Route exact path={`${url}/my-itr`} component={MyITR} />
      <Route exact path={`${url}/redirection`} component={Redirection} />
    </Switch>
  )
}

export default TaxFiling
