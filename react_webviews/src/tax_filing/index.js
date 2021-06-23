import React from 'react'
import { Route, Switch } from 'react-router-dom'

import LandingOld from './pages/LandingOld'

function TaxFiling(props) {
  const { url } = props.match
  return (
    <Switch>
      <Route exact path={`${url}/landing-old`} component={LandingOld} />
    </Switch>
  )
}

export default TaxFiling
