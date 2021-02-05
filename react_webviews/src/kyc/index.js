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
import NotFound from "../common/components/NotFound";

import Journey from './journey'
import Address from './address'
import Upload from './upload'

import { themeConfig } from 'utils/constants'
import './Style.scss'

import Home from './home'
import Nominee from './nominee'
import Report from './report'
import Aadhar from './aadhar'
import PersonalDetails1 from './compliant/PersonalDetails1'
import PersonalDetails2 from './compliant/PersonalDetails2'
import ConfirmPan from './compliant/ConfirmPan'
import KycComplete from './compliant/Complete'
import CompliantReport from './compliant/Report'
import Verify from './compliant/Verify'
import AadharConfirmation from './aadhar/confirmation'

const theme = createMuiTheme(themeConfig)

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
})

const jss = create(jssPreset())

const Kyc = (props) => {
  const { url } = props.match
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}/journey`} component={Journey} />
          <Route exact path={`${url}/address`} component={Address} />
          <Route exact path={`${url}/upload`} component={Upload} />
          <Route exact path={`${url}/home-kyc`} component={Home} />
          <Route exact path={`${url}/:userType/nominee-details`} component={Nominee} />
          <Route exact path={`${url}/report`} component={Report} />
          <Route exact path={`${url}/aadhar`} component={Aadhar} />
          <Route exact path={`${url}/aadhar/confirmation`} component={AadharConfirmation} />
          <Route exact path={`${url}/compliant-personal-details`} component={PersonalDetails1} />
          <Route exact path={`${url}/compliant-personal-details2`} component={PersonalDetails2} />
          <Route exact path={`${url}/compliant-confirm-pan`} component={ConfirmPan} />
          <Route exact path={`${url}/compliant-report-complete`} component={KycComplete} />
          <Route exact path={`${url}/compliant-report-details`} component={CompliantReport} />
          <Route exact path={`${url}/compliant-report-verified`} component={Verify} />                 
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  )
}

export default Kyc
