import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Landing from './pages/Landing'

function TaxFiling(props) {
  const { url } = props.match
  return (
    <Switch>
      <Route exact path={`${url}`} component={Landing} />
    </Switch>
  )
}

export default TaxFiling
