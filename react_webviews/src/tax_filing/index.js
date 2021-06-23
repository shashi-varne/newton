import React from 'react'
import { Route, Switch } from 'react-router-dom'

import LandingOld from './pages/LandingOld'
import Steps from './pages/Steps'

function TaxFiling(props) {
  const { url } = props.match
  return (
    <Switch>
      <Route exact path={`${url}/landing-old`} component={LandingOld} />
      <Route exact path={`${url}/steps`} component={Steps} />
    </Switch>
  )
}

export default TaxFiling
