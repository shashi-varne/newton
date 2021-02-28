import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import Toast from '../../common/ui/Toast'
import { getUrlParams, isEmpty, storageService } from 'utils/validators'
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

  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

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
          address: kyc.address.meta_data,
          nomination: kyc?.nomination?.meta_data,
        },
      }
      const nomination_address = kyc?.nomination?.meta_data?.nominee_address
      item.kyc.nomination.address = nomination_address
      setIsApiRunning(true)
      const result = await submit(item)
      setKyc(result.kyc)
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
    const value = event.target.value
    switch (name) {
      case 'pincode':
        if (value.length <= 6) {
          if (!pinTouched) {
            setPinTouched(true)
          }
          setKyc((kyc) => ({
            ...kyc,
            address: {
              ...kyc?.address,
              meta_data: {
                ...kyc?.address?.meta_data,
                [name]: value,
              },
            },
          }))
          setNomineeData(name, value)
        }
        break
      case 'addressline':
        setKyc((kyc) => ({
          ...kyc,
          address: {
            ...kyc?.address,
            meta_data: {
              ...kyc?.address?.meta_data,
              [name]: value,
            },
          },
        }))
        setNomineeData(name, value)
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
      }
    } catch (err) {
      Toast(err.message, 'error')
    }
  }

  const setNomineeData = (name, value) => {
    setKyc((kyc) => ({
      ...kyc,
      nomination: {
        ...kyc?.nomination,
        meta_data: {
          ...kyc?.nomination.address?.meta_data,
          nominee_address: {
            ...kyc?.nomination?.address?.meta_data?.nominee_address,
            [name]: value,
          }
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

  const getTotalPages = (userKyc) =>
    userKyc?.address?.meta_data?.is_nri ? 4 : 2

  const getAddressProof = (userKyc) => {
    const isNri = userKyc?.address?.meta_data?.is_nri
    if (isNri) {
      return 'Passport'
    }
    return kycDocNameMapper[kyc?.address_doc_type]
  }

  const initialize = async () => {
    try {
      setShowSkelton(true)
      const result = await initData()
      setKyc(result.kyc)
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
    if (kyc?.address?.meta_data?.pincode?.length === 6) {
      fetchPincodeData()
    }
  }, [kyc?.address?.meta_data?.pincode])

  const pincode = kyc?.address?.meta_data?.pincode || ''
  const addressline = kyc?.address?.meta_data?.addressline || ''
  const state = kyc?.address?.meta_data?.state || ''
  const city = kyc?.address?.meta_data?.city || ''
  const isDisabled = isEmpty(pincode) || isEmpty(addressline) || isApiRunning

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
        <div className="flex-between flex-center">
          <div className="title">{title}</div>
          <div className="pageno">2/{getTotalPages(kyc)}</div>
        </div>
        <div className="sub-title">Address as per {getAddressProof(kyc)}</div>
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
            name="addressline"
            className=""
            value={addressline}
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

export default AddressDetails2
