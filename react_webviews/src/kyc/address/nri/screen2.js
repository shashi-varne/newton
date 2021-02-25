import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import Toast from '../../common/ui/Toast'
import { getUrlParams, isEmpty, storageService } from '../../utils/validators'
import { getPinCodeData, submit } from '../common/api'
import Container from '../common/Container'
import { storageConstants, kycDocNameMapper } from '../constants'
import { initData } from '../services'
import { navigate as navigateFunc } from '../common/functions'

const AddressDetails2 = (props) => {
  const [showSkelton, setShowSkelton] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [pinTouched, setPinTouched] = useState(false)
  const [showError, setShowError] = useState(false)
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

  const isDisabled = isEmpty(pincode) || isEmpty(address) || isApiRunning

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
      setNomineeData()
      let item = {
        kyc: {
          address: kyc.address.meta_data,
          nomination: kyc.nomination.meta_data,
        },
      }
      const nomination_address = kyc?.nomination?.meta_data?.nominee_address
      item.kyc.nomination.address = nomination_address
      setIsApiRunning(true)
      await submit(item)
      if (backToJourney !== null) {
        navigate('/kyc/upload/address')
      } else {
        if (kyc?.address?.meta_data?.is_nri) {
          navigate('/kyc/nri-address-details-1', {
            isEdit,
          })
        } else {
          navigate('/kyc/journey')
        }
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
          address: {
            ...userKyc.address,
            meta_data: {
              ...userKyc?.address?.meta_data,
              city: '',
              state: '',
              country: '',
            },
          },
        }))
      } else {
        setKyc((userKyc) => ({
          ...userKyc,
          address: {
            ...userKyc.address,
            meta_data: {
              ...userKyc?.address?.meta_data,
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
      Toast(err.message, 'error')
    }
  }

  const setNomineeData = () => {
    setKyc((kyc) => ({
      ...kyc,
      nomination: {
        ...kyc?.nomination,
        meta_data: {
          ...kyc?.nomination?.meta_data,
          city,
          state,
          pincode,
          addressline: address,
        },
      },
    }))
  }

  const urlParams = getUrlParams(props?.location?.search)

  const isEdit = urlParams?.isEdit
  const backToJourney = urlParams?.backToJourney
  let title = ''

  if (kyc?.address?.meta_data?.is_nri) {
    if (isEdit) {
      title = 'Edit indian address details'
    } else {
      title = 'Indian address details'
    }
  } else {
    if (isEdit) {
      title = 'Edit address details'
    } else {
      title = 'Address details'
    }
  }

  let total_pages = 2

  let address_proof = ''

  if (kyc?.address?.meta_data?.is_nri) {
    address_proof = 'Passport'
    total_pages = 4
  } else {
    address_proof = kycDocNameMapper[kyc?.address_doc_type]
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
      <section id="kyc-bank-kyc-address-details-2" className="page-body-kyc">
        <div className="title">{title}</div>
        <div className="sub-title">Address as per Driving Liscence</div>
        <form className="form-container">
          <TextField
            type="number"
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
            disabled
          />
          <TextField
            label="State"
            name="state"
            className=""
            value={state}
            margin="normal"
            disabled
          />
        </form>
      </section>
    </Container>
  )
}

export default AddressDetails2;
