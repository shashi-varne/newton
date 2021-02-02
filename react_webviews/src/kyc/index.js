import { create } from 'jss'
import JssProvider from 'react-jss/lib/JssProvider'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import { ToastContainer } from 'react-toastify'

import Journey from './journey'
import Address from './address'
import Upload from './upload'

import { themeConfig } from 'utils/constants'

const theme = createMuiTheme(themeConfig)

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
})

const jss = create(jssPreset())

const FundInfo = (props) => {
  const { url } = props.match
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}/journey`} component={Journey} />
          <Route exact path={`${url}/address`} component={Address} />
          <Route exact path={`${url}/upload`} component={Upload} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  )
}

export default FundInfo
