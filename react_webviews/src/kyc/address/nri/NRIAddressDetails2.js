import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import Toast from 'common/ui/Toast'
import { getPinCodeData, submit } from '../../common/api'
import Container from '../../common/Container'
import { kycNRIDocNameMapper } from '../../constants'
import { navigate as navigateFunc } from '../../common/functions'
import useUserKycHook from '../../common/hooks/userKycHook'
import { isEmpty } from '../../../utils/validators'

const NRIAddressDetails2 = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [pinTouched, setPinTouched] = useState(false)
  const [showError, setShowError] = useState(false)
  const [kycData, , isLoading] = useUserKycHook();
  const [kyc, setKyc] = useState(kycData);

  useEffect(() => {
    setKyc(kycData)
  }, [kycData])

  const stateParams = props?.location?.state

  const handleSubmit = async () => {
    const navigate = navigateFunc.bind(props)
    try {
      let item = {
        kyc: {
          nri_address: kyc?.nri_address.meta_data,
        },
      }
      setIsApiRunning("button")
      const result = await submit(item)
      setKyc(result.kyc)
      if (stateParams?.toState) {
        navigate(stateParams?.toState, { userType: stateParams?.userType })
      } else if (stateParams?.backToJourney) {
        navigate('/kyc/upload/address')
      } else if (stateParams?.userType === 'compliant') {
        navigate('/kyc/compliant-personal-details4')
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
    const value = event.target.value
    switch (name) {
      case 'pincode':
        if (event.target.value.length <= 6) {
          if (!pinTouched) {
            setPinTouched(true)
          }
          setKyc((kyc) => ({
            ...kyc,
            nri_address: {
              ...kyc?.nri_address,
              meta_data: {
                ...kyc?.nri_address?.meta_data,
                [name]: value,
              },
            },
          }))
        }
        break
      case 'address':
        setKyc((kyc) => ({
          ...kyc,
          nri_address: {
            ...kyc?.nri_address,
            meta_data: {
              ...kyc?.nri_address?.meta_data,
              addressline: value,
            },
          },
        }))
        break
      case 'city':
        setKyc((kyc) => ({
          ...kyc,
          nri_address: {
            ...kyc?.nri_address,
            meta_data: {
              ...kyc?.nri_address?.meta_data,
              city: value,
            },
          },
        }))
        break
      case 'state':
        setKyc((kyc) => ({
          ...kyc,
          nri_address: {
            ...kyc?.nri_address,
            meta_data: {
              ...kyc?.nri_address?.meta_data,
              state: value,
            },
          },
        }))
        break
      case 'country':
        setKyc((kyc) => ({
          ...kyc,
          nri_address: {
            ...kyc?.nri_address,
            meta_data: {
              ...kyc?.nri_address?.meta_data,
              country: value,
            },
          },
        }))
        break
      default:
        break
    }
  }

  const fetchPincodeData = async () => {
    try {
      const data = await getPinCodeData(kyc?.nri_address?.meta_data?.pincode)
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

  useEffect(() => {
    if (kyc?.nri_address?.meta_data?.pincode.length === 6) {
      fetchPincodeData()
    }
  }, [kyc?.nri_address?.meta_data?.pincode])

  const pincode = kyc?.nri_address?.meta_data?.pincode || ''
  const addressline = kyc?.nri_address?.meta_data?.addressline || ''
  const state = kyc?.nri_address?.meta_data?.state || ''
  const city = kyc?.nri_address?.meta_data?.city || ''
  const country = kyc?.nri_address?.meta_data?.country || ''
  const isDisabled = isEmpty(pincode) || isEmpty(addressline) || pincode?.length < 6

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
      if(pincode.length === 6 && state === '') {
        return 'Please enter valid pincode'
      }
    }
  }

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      skelton={isLoading}
      disable={isDisabled}
      // hideInPageTitle
      handleClick={handleSubmit}
      showLoader={isApiRunning}
      title={title}
      current={4}
      count={4}
      total={4}
    >
      <section id="kyc-address-details-2" className="page-body-kyc">
        {/* <div className="flex-between flex-center">
          <div className="title">{title}</div>
          <div className="pageno">4/4</div>
        </div> */}
        <div className="sub-title">Address as per {address_proof}</div>
        <form className="form-container">
          <TextField
            label="Pincode"
            name="pincode"
            className=""
            value={pincode}
            onChange={handleChange}
            margin="normal"
            helperText={(pinTouched || (state === '' && pincode.length === 6) ) && getHelperText(pincode)}
            inputProps={{ minLength: 6, maxLength: 6 }}
            error={(pinTouched && pincode.length !== 6) || (state === '' && pincode.length === 6) }
            size="6"
            required
          />
          <TextField
            label="Address"
            name="address"
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
