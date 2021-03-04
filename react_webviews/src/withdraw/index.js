import React, { useEffect } from 'react'
import WithdrawType from './components/WithdrawType'
import WithdrawReason from './components/WithdrawReason'
import WithdrawRemark from './components/WithdrawRemark'
import Landing from './components/balance'

import { Switch, Route, withRouter } from 'react-router-dom'
import { create } from 'jss'
import JssProvider from 'react-jss/lib/JssProvider'

import './Style.scss'

import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import { ToastContainer } from 'react-toastify'
import NotFound from '../common/components/NotFound'
import { themeConfig } from 'utils/constants'
import './Style.scss'

import SystemSummary from './components/summary/system'
import SelfSummary from './components/summary/self'
import Insta from './components/summary/insta'

const theme = createMuiTheme(themeConfig)

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
})
const jss = create(jssPreset())
const ScrollToTopWithoutRouter = (props) => {
  const { location } = props
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return null
}
const ScrollToTop = withRouter(ScrollToTopWithoutRouter)

const Withdraw = ({ match }) => {
  const { url } = match
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <ScrollToTop />
        <Switch>
          <Route exact path={`${url}`} component={Landing} />
          <Route
            exact
            path={`${url}/system/summary`}
            component={SystemSummary}
          />
          <Route path={`${url}/self/summary`} component={SelfSummary} />
          <Route path={`${url}/system/summary`} component={SystemSummary} />
          <Route path={`${url}/insta/summary`} component={Insta} />
          <Route path={`${url}/type`} component={WithdrawType} />
          <Route path={`${url}/reason`} component={WithdrawReason} />
          <Route path={`${url}/remark`} component={WithdrawRemark} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  )
}

export default Withdraw
