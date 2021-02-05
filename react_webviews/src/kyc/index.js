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
import CompliantPersonalDetails1 from './compliant/PersonalDetails1'
import CompliantPersonalDetails2 from './compliant/PersonalDetails2'
import ConfirmPan from './compliant/ConfirmPan'
import KycComplete from './compliant/Complete'
import CompliantReport from './compliant/Report'
import Verify from './compliant/Verify'
import AadharConfirmation from './aadhar/confirmation'
import RtaCompliantPersonalDetails from './rta_compliant'
import RegistrationSuccess from './success'
import AddBank from './bank/AddBank'
import AddBankVerify from './bank/AddBankVerify'
import BanksList from './bank/BanksList'
import BankDetails from './bank/BankDetails'
import PersonalDetails1 from './personal_details/Screen1'
import PersonalDetails2 from './personal_details/Screen2'

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
          <Route exact path={`${url}/personal-details1`} component={PersonalDetails1} />
          <Route exact path={`${url}/personal-details2`} component={PersonalDetails2} />
          <Route exact path={`${url}/address`} component={Address} />
          <Route exact path={`${url}/upload`} component={Upload} />
          <Route exact path={`${url}/home-kyc`} component={Home} />
          <Route exact path={`${url}/:userType/nominee-details`} component={Nominee} />
          <Route exact path={`${url}/report`} component={Report} />
          <Route exact path={`${url}/aadhar`} component={Aadhar} />
          <Route exact path={`${url}/aadhar/confirmation`} component={AadharConfirmation} />
          <Route exact path={`${url}/compliant-personal-details`} component={CompliantPersonalDetails1} />
          <Route exact path={`${url}/compliant-personal-details2`} component={CompliantPersonalDetails2} />
          <Route exact path={`${url}/compliant-confirm-pan`} component={ConfirmPan} />
          <Route exact path={`${url}/compliant-report-complete`} component={KycComplete} />
          <Route exact path={`${url}/compliant-report-details`} component={CompliantReport} />
          <Route exact path={`${url}/compliant-report-verified`} component={Verify} />
          <Route exact path={`${url}/rta-compliant-personal-details`} component={RtaCompliantPersonalDetails} />
          <Route exact path={`${url}/registration/success`} component={RegistrationSuccess} />
          <Route exact path={`${url}/approved/banks/doc`} component={AddBank} />
          <Route exact path={`${url}/approved/banks/verify/:bank_id`} component={AddBankVerify} />
          <Route exact path={`${url}/add-bank`} component={BanksList} />
          <Route exact path={`${url}/add-bank/details/:bank_id`} component={BankDetails} />                
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  )
}

export default Kyc
