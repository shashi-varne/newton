import React from 'react'
import { Route, Switch } from 'react-router-dom'
import FundList from './components/FundList'

const DIY = (props) => {
  const { url } = props.match

  return (
    <Switch>
      <Route exact path={`${url}/fundlist`} component={FundList} />
    </Switch>
  )
}

export default DIY
