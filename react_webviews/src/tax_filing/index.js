import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Landing from './pages/Landing'
import PersonalDetails from './pages/PersonalDetails'
import Steps from './pages/Steps'
import MyITR from './pages/MyITR'
import Redirection from './pages/Redirection'
import RenderFaqs from './pages/RenderFaqs'
import Callback from './pages/Callback'
import NotFound from 'common/components/NotFound'

function TaxFiling(props) {
  const { url } = props.match
  return (
    <Switch>
      <Route exact path={`${url}`} component={Landing} />
      <Route exact path={`${url}/steps`} component={Steps} />
      <Route
        exact
        path={`${url}/personal-details`}
        component={PersonalDetails}
      />
      <Route exact path={`${url}/my-itr`} component={MyITR} />
      <Route exact path={`${url}/redirection`} component={Redirection} />
      <Route exact path={`${url}/faqs`} component={RenderFaqs} />
      <Route exact path={`${url}/callback`} component={Callback} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default TaxFiling
