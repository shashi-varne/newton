import './PersonalDetails.scss'

import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import Input from 'common/ui/Input'
import BottomSheet from 'common/ui/BottomSheet'
import { validateEmail, validateNumber } from 'utils/validators'

import {
  navigate as navigateFunc,
  trackBackButtonPress,
  parsePhoneNumber,
} from '../common/functions'
import { getConfig } from 'utils/functions'
import { isEmpty } from 'lodash'

import { createITRApplication, getITRUserDetails } from '../common/ApiCalls'
import { storageService } from '../../utils/validators'
import { ITR_TYPE_KEY, USER_DETAILS, USER_SUMMARY_KEY } from '../constants'

import { nativeCallback } from 'utils/native_callback'

function PersonalDetails(props) {
  const navigate = navigateFunc.bind(props)
  const productName = getConfig().productName

  const closeError = () => {
    setShowLoader(false)
    setShowError(false)
  }

  const summary = storageService().getObject(USER_SUMMARY_KEY) || {}

  const defaultUser = props?.location?.params?.user || {}

  const type =
    props?.location?.params?.type || storageService().get(ITR_TYPE_KEY) || ''

  if (isEmpty(type)) {
    navigate(`/tax-filing`, {}, false)
    return
  }

  const [showLoader, setShowLoader] = useState(false)
  const [showSkeltonLoader, setShowSkeltonLoader] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [errorData, setErrorData] = useState({})

  const [user, setUser] = useState(defaultUser)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [mobileNumber, setMobileNumber] = useState(
    parsePhoneNumber(user?.phone) || ''
  )

  const [, setItrId] = useState('')
  const [itrSSOURL, setITRSSOURL] = useState('')

  useEffect(() => {
    fetchUserSummary()
  }, [])

  const fetchUserSummary = async () => {
    try {
      if (isEmpty(user)) {
        setShowSkeltonLoader(true)
        const userDetails = await getITRUserDetails()
        setUser({ ...userDetails })
        setName(userDetails?.name)
        setEmail(userDetails?.email)
        setMobileNumber(parsePhoneNumber(userDetails?.phone))
        storageService().setObject(USER_DETAILS, userDetails)
        setShowSkeltonLoader(false)
      }
    } catch (err) {
      showError(true)
      setErrorData({
        type: 'crash',
        title2: err.message,
        handleClick2: closeError,
      })
    } finally {
      setShowSkeltonLoader(false)
    }
  }

  const [errors, setErrors] = useState({
    email: false,
    name: false,
    mobileNumber: false,
  })

  const handleFocus = (type) => () => {
    if (errors[type]) {
      setErrors({ ...errors, [type]: false })
    }
  }

  const handleBlur = (type) => () => {
    switch (type) {
      case 'email':
        if (!validateEmail(email)) {
          setErrors({ ...errors, email: true })
        }
        break
      case 'mobileNumber':
        if (!validateNumber(mobileNumber)) {
          setErrors({ ...errors, mobileNumber: true })
        }
        break
      case 'name':
        if (name.length === 0) {
          setErrors({ ...errors, name: true })
        }
        break
      default:
        break
    }
  }

  const handleChange = (type) => (event) => {
    const value = event.target.value
    switch (type) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value.trim())
        break
      case 'mobileNumber':
        if (!isNaN(value)) {
          setMobileNumber(value)
        }
        break
      default:
        break
    }
  }

  const handleProceed = async () => {
    sendEvents('next', { screenName: 'Application Created' })
    navigate('/tax-filing/redirection', { redirectionUrl: itrSSOURL }, false)
    return
  }

  const goBack = () => {
    trackBackButtonPress(props?.history?.location?.pathname)
    sendEvents('back', { screenName: 'Personal Detail' })
    props.history.goBack()
  }

  const sendEvents = (userAction, data = {}) => {
    const type = storageService().get(ITR_TYPE_KEY)
    const investment_status = summary?.kyc?.investment_status ? 'Y' : 'N'
    const kyc_status = summary?.kyc?.kyc_status ? 'Y' : 'N'
    let eventObj = {}
    if (data?.screenName === 'Personal Detail') {
      eventObj = {
        event_name: 'ITR',
        properties: {
          user_action: userAction,
          screen_name: data?.screenName || 'Personal Detail',
          category: type,
          investment_status,
          kyc_status,
        },
      }
    } else {
      eventObj = {
        event_name: 'ITR',
        properties: {
          user_action: userAction,
          screen_name: data?.screenName,
        },
      }
    }

    if (userAction === 'just_set_events') {
      return eventObj
    } else {
      nativeCallback({ events: eventObj })
    }
  }

  const retry = () => {
    closeError()
    handleClick()
  }

  const handleClick = async () => {
    try {
      const type = storageService().get(ITR_TYPE_KEY)
      setShowLoader('button')
      sendEvents('next', { screenName: 'Personal Details' })
      const itr = await createITRApplication({
        type,
        email,
        name,
        phone: parsePhoneNumber(mobileNumber),
      })
      setItrId(itr.itr_id)
      setITRSSOURL(itr.sso_url)
      setShowBottomSheet(true)
      setShowLoader(false)
    } catch (err) {
      setShowLoader(false)
      setShowError(true)
      setErrorData({
        type: 'generic',
        title2: err.message,
        handleClick2: closeError,
        handleClick1: retry,
      })
    }
  }

  const isDisabledProceed =
    errors.email ||
    errors.mobileNumber ||
    errors.name ||
    isEmpty(name) ||
    isEmpty(mobileNumber) ||
    isEmpty(email) ||
    mobileNumber.length !== 10

  return (
    <Container
      title="Personal Details"
      smallTitle="Fill your details to start"
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      showError={showError}
      errorData={errorData}
      headerData={{ goBack }}
      skelton={showSkeltonLoader}
      showLoader={showLoader}
      disable={isDisabledProceed}
    >
      <form className="block tax-filing-details">
        <Input
          type="text"
          value={name}
          label="Name"
          onFocus={handleFocus('name')}
          onBlur={handleBlur('name')}
          onChange={handleChange('name')}
          class="block m-top-3x"
          variant="outlined"
          disabled={!isEmpty(user?.name)}
          error={errors?.name}
          helperText={errors?.name ? 'Please enter a valid name' : ''}
          required
        />
        <Input
          type="email"
          value={email || ''}
          label="Email"
          onFocus={handleFocus('email')}
          onBlur={handleBlur('email')}
          onChange={handleChange('email')}
          class="block m-top-3x"
          variant="outlined"
          disabled={!isEmpty(user?.email) && validateEmail(user?.email)}
          error={errors?.email}
          helperText={errors?.email ? 'Please enter a valid email address' : ''}
          required
        />
        <Input
          type="text"
          value={mobileNumber}
          label="Mobile Number"
          onFocus={handleFocus('mobileNumber')}
          onBlur={handleBlur('mobileNumber')}
          onChange={handleChange('mobileNumber')}
          class="block m-top-3x"
          variant="outlined"
          disabled={!isEmpty(user?.phone)}
          error={errors?.mobileNumber}
          helperText={
            errors?.mobileNumber ? 'Please enter a correct mobile number' : ''
          }
          required
        />
      </form>
      <BottomSheet
        open={showBottomSheet}
        data={{
          header_title:
            type === 'free' ? 'Application created' : 'ITR application created',
          content:
            type === 'free'
              ? 'Great job! Only a few more details required for ITR calculation'
              : 'Now, answer a few simple questions and get the plan',
          src: require(`assets/${productName}/icn_application_created.svg`),
          button_text1: 'CONTINUE',
          handleClick1: handleProceed,
          handleClose: () => {},
        }}
      />
    </Container>
  )
}

export default PersonalDetails
