import React, { useState } from 'react'
import Container from '../common/Container'
import Input from 'common/ui/Input'
import { validateEmail, validateNumber } from 'utils/validators'

import { navigate as navigateFunc } from '../common/functions'

import './PersonalDetails.scss'

function PersonalDetails(props) {
  const navigate = navigateFunc.bind(props)

  const [name, setName] = useState('Ashish Thakur')
  const [email, setEmail] = useState('ashish.thakur@fisdom.com')
  const [mobileNumber, setMobileNumber] = useState('9999999999')

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
        if (!validateEmail(email)) {
          setErrors({ ...errors, mobileNumber: true })
        }
      case 'name':
        if (name.length === 0) {
          setErrors({ ...errors, name: true })
        }
    }
  }

  const handleChange = (type) => (event) => {
    const value = event.target.value.trim()
    switch (type) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'mobileNumber':
        setMobileNumber(value)
        break
      default:
        break
    }
  }

  const handleClick = () => {
    navigate('/tax-filing/redirection', {}, false)
    return
  }

  return (
    <Container
      title="Personal Details"
      smallTitle="Fill your details to start"
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      showLoader={false}
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
          error={errors?.mobileNumber}
          helperText={
            errors?.mobileNumber ? 'Please enter a correct mobile number' : ''
          }
          required
        />
      </form>
    </Container>
  )
}

export default PersonalDetails
