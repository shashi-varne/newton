import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import Input from 'common/ui/Input'
import BottomSheet from 'common/ui/BottomSheet'
import { validateEmail, validateNumber } from 'utils/validators'

import { navigate as navigateFunc } from '../common/functions'
import { getConfig } from 'utils/functions'
import { isEmpty } from 'lodash'

import { createITRApplication, getUserAccountSummary } from '../common/ApiCalls'
import { storageService } from '../../utils/validators'
import { ITR_TYPE_KEY } from '../constants'

import './PersonalDetails.scss'

function PersonalDetails(props) {
  const navigate = navigateFunc.bind(props)
  const productName = getConfig().productName

  const closeError = () => {
    setShowError(false)
  }

  const defaultUserSummary = props?.location?.params?.userSummary || {}

  const [userSummary, setUserSummary] = useState(defaultUserSummary)
  const [showLoader, setShowLoader] = useState(false)
  const [showSkeltonLoader, setShowSkeltonLoader] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [errorData, setErrorData] = useState({})

  const [name, setName] = useState(userSummary?.name || '')
  const [email, setEmail] = useState(userSummary?.name || '')
  const [mobileNumber, setMobileNumber] = useState(userSummary?.mobile || '')

  const [, setItrId] = useState('')
  const [itrSSOURL, setITRSSOURL] = useState('')

  useEffect(() => {
    fetchUserSummary()
  }, [])

  const fetchUserSummary = async () => {
    try {
      if (isEmpty(userSummary)) {
        setShowSkeltonLoader(true)
        const summary = await getUserAccountSummary()
        setUserSummary(summary?.user)
        setName(summary?.user?.name)
        setEmail(summary?.user?.email)
        setMobileNumber(summary?.user?.mobile)
        setShowSkeltonLoader(false)
      }
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'crash',
        title: err.message,
        handleClick: closeError,
      })
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
        setMobileNumber(value.trim())
        break
      default:
        break
    }
  }

  const handleProceed = async () => {
    try {
      navigate('/tax-filing/redirection', { redirectionUrl: itrSSOURL }, false)
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'crash',
        title1: err.message,
        button_text1: 'CLOSE',
        handleClick1: closeError,
      })
    }
  }

  const handleClick = async () => {
    try {
      const type = storageService().get(ITR_TYPE_KEY)
      setShowLoader('button')
      const itr = await createITRApplication({
        type,
        email,
        name,
        mobile: mobileNumber,
      })
      setItrId(itr.itr_id)
      setITRSSOURL(itr.sso_url)
      setShowBottomSheet(true)
      setShowLoader(false)
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'generic',
        title1: err.message,
        button_text1: 'CLOSE',
        button_text2: 'RETRY',
        handleClick2: handleClick,
        handleClick1: closeError,
      })
      setShowBottomSheet(false)
      setShowLoader(false)
    }
  }

  return (
    <Container
      title="Personal Details"
      smallTitle="Fill your details to start"
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      showError={showError}
      errorData={errorData}
      skelton={showSkeltonLoader}
      showLoader={showLoader}
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
          disabled={!isEmpty(userSummary?.name)}
          error={errors?.name}
          helperText={errors?.name ? 'Please enter a valid name' : ''}
          required
        />
        <Input
          type="email"
          value={email}
          label="Email"
          onFocus={handleFocus('email')}
          onBlur={handleBlur('email')}
          onChange={handleChange('email')}
          class="block m-top-3x"
          variant="outlined"
          disabled={!isEmpty(userSummary?.email)}
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
          disabled={!isEmpty(userSummary?.mobile)}
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
          header_title: 'Application created',
          content:
            'Great job! Only a few more details required for ITR calculation',
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
