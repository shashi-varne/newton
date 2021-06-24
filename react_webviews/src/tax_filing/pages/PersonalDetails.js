import React, { useState } from 'react'
import Container from '../common/Container'
import Input from 'common/ui/Input'

import { navigate as navigateFunc } from '../common/functions'

import './PersonalDetails.scss'

function PersonalDetails(props) {
  const navigate = navigateFunc.bind(props)

  const [name, setName] = useState('Ashish Thakur')
  const [email, setEmail] = useState('ashish.thakur@fisdom.com')
  const [mobileNumber, setMobileNumber] = useState('9999999999')

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
          onChange={handleChange('name')}
          class="block m-top-3x"
          variant="outlined"
          error={true}
          helperText="Valid name"
        />
        <Input
          type="email"
          value={email}
          label="Email"
          onChange={handleChange('email')}
          class="block m-top-3x"
          variant="outlined"
          disabled
        />
        <Input
          type="text"
          value={mobileNumber}
          label="Mobile Number"
          onChange={handleChange('mobileNumber')}
          class="block m-top-3x"
          variant="outlined"
        />
      </form>
    </Container>
  )
}

export default PersonalDetails
