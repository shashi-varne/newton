import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import Toast from 'common/ui/Toast'
import { getUrlParams, isEmpty, storageService } from 'utils/validators'
import { getPinCodeData, submit } from '../../common/api'
import Container from '../../common/Container'
import { storageConstants, kycNRIDocNameMapper } from '../../constants'
import { initData } from '../../services'
import { navigate as navigateFunc } from '../../common/functions'

const NRIAddressDetails2 = (props) => {
  const [showSkelton, setShowSkelton] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [pinTouched, setPinTouched] = useState(false)
  const [showError, setShowError] = useState(false)
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

  const isDisabled = isEmpty(pincode) || isEmpty(address) || isApiRunning
  const stateParams = props?.location?.state

  const getHelperText = (pincode) => {
    if (typeof pincode === 'string') {
      if (pincode.length === 0) {
        return 'This is required'
      }
      if (pincode.length < 6) {
        return 'Minlength is 6'
      }
      if (pincode.length > 6) {
        return 'Maxlength is 6'
      }
    }
  }

  const handleSubmit = async () => {
    const navigate = navigateFunc.bind(props)
    try {
      let item = {
        kyc: {
          nri_address: kyc?.nri_address.meta_data,
        },
      }
      setIsApiRunning(true)
      await submit(item)
      if (stateParams?.toState) {
        navigate(stateParams?.toState, { userType: stateParams?.userType })
      } else if (stateParams?.backToJourney) {
        navigate('/kyc/upload/address')
      } else if (stateParams?.userType === 'compliant') {
        navigate('/kyc/compliant-personal-details2')
      } else {
        navigate('/kyc/journey')
      }
    } catch (err) {
      setShowError(err.message)
      Toast(err.message, 'error')
    } finally {
      setIsApiRunning(false)
      setShowError(false)
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    switch (name) {
      case 'pincode':
        if (event.target.value.length <= 6) {
          if (!pinTouched) {
            setPinTouched(true)
          }
          setPincode(event.target.value)
        }
        break
      case 'address':
        setAddress(event.target.value)
        break
      case 'city':
        setCity(event.target.value)
        break
      case 'state':
        setState(event.target.value)
        break
      case 'country':
        setCountry(event.target.value)
        break
      default:
        break
    }
  }

  const fetchPincodeData = async () => {
    try {
      const data = await getPinCodeData(pincode)
      if (data.length === 0) {
        setKyc((userKyc) => ({
          ...userKyc,
          nri_address: {
            ...userKyc.nri_address,
            meta_data: {
              ...userKyc?.nri_address?.meta_data,
              city: '',
              state: '',
              country: '',
            },
          },
        }))
      } else {
        setKyc((userKyc) => ({
          ...userKyc,
          nri_address: {
            ...userKyc.nri_address,
            meta_data: {
              ...userKyc?.nri_address?.meta_data,
              city: data[0].district_name,
              state: data[0].state_name,
              country: 'INDIA',
            },
          },
        }))
        setCity(data[0].district_name)
        setState(data[0].state_name)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isEdit = stateParams?.isEdit
  let title = ''

  if (kyc?.address?.meta_data?.is_nri) {
    if (isEdit) {
      title = 'Edit Foreign address details'
    } else {
      title = 'Foreign address details'
    }
  } else {
    if (isEdit) {
      title = 'Edit address details'
    } else {
      title = 'Address details'
    }
  }

  let address_proof = ''

  if (kyc?.address?.meta_data?.is_nri) {
    address_proof = 'Passport'
  } else {
    address_proof = kycNRIDocNameMapper[kyc?.address_doc_type]
  }

  const initialize = async () => {
    try {
      setShowSkelton(true)
      await initData()
      const kyc = storageService().getObject(storageConstants.KYC)
      setKyc(kyc)
    } catch (err) {
      setShowError(true)
    } finally {
      setShowSkelton(false)
    }
  }

  useEffect(() => {
    if (!kyc || isEmpty(kyc)) {
      initialize()
    }
  }, [])

  useEffect(() => {
    if (pincode.length === 6) {
      fetchPincodeData()
    }
  }, [pincode])

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      showSkelton={showSkelton}
      disable={isDisabled}
      hideInPageTitle
      handleClick={handleSubmit}
      isApiRunning={isApiRunning}
    >
      <section id="kyc-address-details-2" className="page-body-kyc">
        <div className="flex-between flex-center">
          <div className="title">{title}</div>
          <div className="pageno">4/4</div>
        </div>
        <div className="sub-title">Address as per {address_proof}</div>
        <form className="form-container">
          <TextField
            label="Pincode"
            name="pincode"
            className=""
            value={pincode}
            onChange={handleChange}
            margin="normal"
            helperText={pinTouched && getHelperText(pincode)}
            inputProps={{ minLength: 6, maxLength: 6 }}
            error={pinTouched && pincode.length !== 6}
            size="6"
            required
          />
          <TextField
            label="Address"
            name="address"
            className=""
            value={address}
            onChange={handleChange}
            margin="normal"
            multiline
          />
          <TextField
            label="City"
            name="city"
            className=""
            value={city}
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="State"
            name="state"
            className=""
            value={state}
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Country"
            name="country"
            className=""
            value={country}
            margin="normal"
            onChange={handleChange}
          />
        </form>
      </section>
    </Container>
  )
}

export default NRIAddressDetails2
